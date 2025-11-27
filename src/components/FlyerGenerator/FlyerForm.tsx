import React from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister } from 'react-hook-form';

interface FlyerFormData {
    title: string;
    subtitle: string;
    date: string;
    venue: string;
    city: string;
    lineup: { name: string }[];
    backgroundImage?: FileList;
}

interface FlyerFormProps {
    register: UseFormRegister<FlyerFormData>;
    control: Control<FlyerFormData>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors: any;
}

const FlyerForm: React.FC<FlyerFormProps> = ({ register, control, errors }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "lineup"
    });

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Titre de l'événement</label>
                    <input
                        {...register("title", { required: true })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                        placeholder="EX: ATLAS"
                    />
                    {errors.title && <span className="text-red-500 text-xs">Requis</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Sous-titre</label>
                    <input
                        {...register("subtitle")}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                        placeholder="EX: TECHNO EDITION"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                        <input
                            {...register("date", { required: true })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                            placeholder="18 AVRIL 2026"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Ville</label>
                        <input
                            {...register("city", { required: true })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                            placeholder="BORDEAUX"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Lieu</label>
                    <input
                        {...register("venue", { required: true })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                        placeholder="ARKEA ARENA"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Lineup</label>
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                            <input
                                {...register(`lineup.${index}.name` as const, { required: true })}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-munera-violet focus:outline-none"
                                placeholder="Nom de l'artiste"
                            />
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => append({ name: "" })}
                        className="flex items-center gap-2 text-sm text-munera-violet hover:text-white transition-colors mt-2"
                    >
                        <Plus size={16} /> Ajouter un artiste
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Image de fond</label>
                <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-munera-violet/50 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        accept="image/*"
                        {...register("backgroundImage")}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto text-gray-500 mb-2" size={24} />
                    <p className="text-sm text-gray-400">Glisser une image ou cliquer pour upload</p>
                </div>
            </div>
        </div>
    );
};

export default FlyerForm;
