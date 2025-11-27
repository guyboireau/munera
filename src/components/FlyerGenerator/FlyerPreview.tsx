import React, { useEffect, useRef } from 'react';

interface FlyerData {
    title: string;
    subtitle: string;
    date: string;
    venue: string;
    city: string;
    lineup: string[];
    backgroundImage?: string;
}

interface FlyerPreviewProps {
    data: FlyerData;
}

const FlyerPreview: React.FC<FlyerPreviewProps> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions (1080x1350 for Instagram Portrait)
        canvas.width = 1080;
        canvas.height = 1350;

        // Draw Background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a0f3e');
        gradient.addColorStop(1, '#2d1b69');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Background Image if exists
        if (data.backgroundImage) {
            const img = new Image();
            img.src = data.backgroundImage;
            img.onload = () => {
                // Cover fit
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                ctx.globalAlpha = 0.5;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                ctx.globalAlpha = 1.0;
                drawText(ctx);
            };
        } else {
            drawText(ctx);
        }

        function drawText(context: CanvasRenderingContext2D) {
            if (!canvas) return;
            // Title
            context.font = 'bold 120px Inter, sans-serif';
            context.fillStyle = '#ffffff';
            context.textAlign = 'center';
            context.shadowColor = '#8b5cf6';
            context.shadowBlur = 40;
            context.fillText(data.title.toUpperCase(), canvas.width / 2, 300);

            // Subtitle
            context.font = '300 40px Inter, sans-serif';
            context.shadowBlur = 20;
            context.fillText(data.subtitle.toUpperCase(), canvas.width / 2, 380);

            // Lineup
            context.font = 'bold 60px Inter, sans-serif';
            context.shadowColor = '#3b82f6';
            context.shadowBlur = 30;
            let startY = 600;
            data.lineup.forEach((artist, index) => {
                if (!canvas) return;
                context.fillText(artist.toUpperCase(), canvas.width / 2, startY + (index * 100));
            });

            // Footer Info
            const footerY = 1200;
            context.font = 'bold 40px Inter, sans-serif';
            context.shadowColor = 'transparent';
            context.shadowBlur = 0;
            context.fillText(`${data.date} • ${data.venue} • ${data.city}`.toUpperCase(), canvas.width / 2, footerY);

            // Logo
            context.font = 'bold 30px Inter, sans-serif';
            context.fillStyle = '#8b5cf6';
            context.fillText("MUNERA COLLECTIVE", canvas.width / 2, canvas.height - 50);
        }

    }, [data]);

    const downloadFlyer = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `munera-flyer-${data.title.toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain bg-munera-darker"
                />
            </div>
            <button
                onClick={downloadFlyer}
                className="w-full py-3 bg-munera-violet hover:bg-munera-violet/80 text-white font-bold rounded-lg transition-colors"
            >
                TÉLÉCHARGER PNG
            </button>
        </div>
    );
};

export default FlyerPreview;
