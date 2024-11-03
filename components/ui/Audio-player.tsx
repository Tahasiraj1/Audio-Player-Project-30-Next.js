"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
    ForwardIcon,
    PlayIcon,
    RewindIcon,
    UploadIcon,
    PauseIcon,
} from "lucide-react";
import Image from "next/image";

interface Track {
    title: string;
    artist: string;
    src: string;
};

const AudioPlayer = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Handle File Upload
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newTracks: Track[] = Array.from(files).map((file) => ({
                title: file.name,
                artist: "Unknown Artist",
                src: URL.createObjectURL(file),
            }));
            setTracks((prevTracks) => [...prevTracks, ...newTracks]);
        }
    };

    // Handle Play/Pause Toggle
    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    };

    // Handle Next Track
    const handleNextTrack = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    };

    // Handle Previous Track
    const handlePrevTrack = () => {
        setCurrentTrackIndex((prevIndex) => 
        prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
        );
    };


    // Handle Time Updates
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setProgress(
                (audioRef.current.currentTime / audioRef.current.duration) * 100
            );
        }
    };

    // Load Metadata
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };


    // format time in minutes and seconds
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`
    };

    useEffect(() => {
        // Only load the new track if `tracks` or `currentTrackIndex` changes
        if (audioRef.current && tracks[currentTrackIndex]) {
            audioRef.current.src = tracks[currentTrackIndex].src;
            audioRef.current.load();
            audioRef.current.currentTime = 0;
            setCurrentTime(0);
            setProgress(0);
        }
    }, [currentTrackIndex, tracks]);


    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground"
        style={{
            backgroundImage: `url('/sound3.jpg')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
        }}
        >
            <div className="max-w-md w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">
                        Audio Player
                    </h1>
                    <label className="flex items-center cursor-pointer text-white">
                        <UploadIcon className="w-5 h-5 mr-2" />
                        <span>Upload</span>
                        <input
                        type="file"
                        accept="audio/*"
                        multiple
                        className="hidden"
                        onChange={handleUpload}
                        />
                    </label>
                </div>
                <Card className="bg-slate-300 bg-opacity-70">
                    <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
                        <Image
                        src="/music.svg"
                        alt="Album Cover"
                        width={100}
                        height={100}
                        className="rounded-full w-32 h-32 object-cover"
                        />
                        <div className="text-center">
                            <h2 className="text-xl font-bold ">
                                {tracks[currentTrackIndex]?.title || "Audio Title"}
                            </h2>
                            <p>
                                {tracks[currentTrackIndex]?.artist || "Person Name"}
                            </p>
                        </div>
                        <div className="w-full">
                            <div className="flex justify-between text-sm text-muted-foreground text-black">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                            <Progress value={progress} />
                        </div>
                        <div className="flex items-center gap-4">
                            <Button 
                            variant="ghost"
                            size="icon"
                            onClick={handlePrevTrack}
                            >
                                <RewindIcon className="w-6 h-6" />
                            </Button>
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePlayPause}
                            >
                                {isPlaying ? (
                                    <PauseIcon className="w-6 h-6" />
                                ): (
                                    <PlayIcon className="w-6 h-6" />
                                )}
                            </Button>
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNextTrack}
                            >
                                <ForwardIcon className="w-6 h-6" />
                            </Button>
                        </div>
                        <audio
                        ref={audioRef}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default AudioPlayer;