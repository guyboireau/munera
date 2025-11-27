import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FlyerForm from '../components/FlyerGenerator/FlyerForm';
import FlyerPreview from '../components/FlyerGenerator/FlyerPreview';

interface FlyerFormData {
    title: string;
    subtitle: string;
    date: string;
    venue: string;
    city: string;
    lineup: { name: string }[];
    backgroundImage?: FileList;
}

const FlyerGenerator = () => {
    const { register, control, watch, formState: { errors } } = useForm<FlyerFormData>({
        defaultValues: {
            title: "MUNERA",
            subtitle: "TECHNO EDITION",
            date: "18 AVRIL 2026",
            venue: "ARKEA ARENA",
            city: "BORDEAUX",
            lineup: [{ name: "VORTEK'S" }, { name: "FLKN" }]
        }
    });

    const [previewData, setPreviewData] = useState({
        title: "MUNERA",
        subtitle: "TECHNO EDITION",
        date: "18 AVRIL 2026",
        venue: "ARKEA ARENA",
        city: "BORDEAUX",
        lineup: ["VORTEK'S", "FLKN"],
        backgroundImage: undefined as string | undefined
    });

    useEffect(() => {
        const subscription = watch((value) => {
            let bgUrl = previewData.backgroundImage;

            if (value.backgroundImage && value.backgroundImage.length > 0) {
                bgUrl = URL.createObjectURL(value.backgroundImage[0]);
            }

            setPreviewData({
                title: value.title || "",
                subtitle: value.subtitle || "",
                date: value.date || "",
                venue: value.venue || "",
                city: value.city || "",
                lineup: value.lineup?.map((l) => l?.name || "") || [],
                backgroundImage: bgUrl
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, previewData.backgroundImage]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 text-white text-glow">STUDIO GRAPHIQUE</h1>
                <p className="text-gray-400">Créez vos visuels en quelques clics.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-munera-darker/50 p-8 rounded-xl border border-white/5">
                    <h2 className="text-2xl font-bold mb-6 text-white">Configuration</h2>
                    <FlyerForm register={register} control={control} errors={errors} />
                </div>

                <div className="sticky top-24">
                    <h2 className="text-2xl font-bold mb-6 text-white">Aperçu en direct</h2>
                    <FlyerPreview data={previewData} />
                </div>
            </div>
        </div>
    );
};

export default FlyerGenerator;
