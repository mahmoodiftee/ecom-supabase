
'use client'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Eye, Plus, ImageIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'

// Updated schema to make image field optional for file uploads
const keyboardFormSchema = z.object({
    title: z.string().min(1, 'Required'),
    price: z.number().min(0, 'Must be positive'),
    stock: z.enum(['inStock', 'outOfStock', 'preOrder']),
    quantity: z.number().min(0, 'Must be zero or positive').int(),
    brand: z.string().min(1, 'Required'),
    description: z.string().optional(),
    warranty: z.string().optional(),
    weight: z.string().optional(),
    discount: z.number().min(0).max(100).optional(),
    image: z.string().optional(), // Changed to optional since we'll handle file uploads
    images: z.array(z.string().url('Must be a valid URL')).optional(),
    information: z.array(
        z.object({
            feature: z.string().min(1, 'Required'),
            value: z.string().min(1, 'Required')
        })
    ).min(1),
    specifications: z.object({
        general: z.object({
            color: z.string().optional(),
            model: z.string().optional(),
            layout: z.string().optional(),
            keyboard_shell: z.string().optional(),
            surface_finish: z.string().optional(),
        }),
        keycaps: z.object({
            profile: z.string().optional(),
            material: z.string().optional(),
        }),
        plate_pcb: z.object({
            pcb: z.string().optional(),
            plate_material: z.string().optional(),
            quick_disassemble: z.string().optional(),
        }),
        rgb_customization: z.object({
            backlight: z.string().optional(),
            software_support: z.string().optional(),
        }),
        additional_features: z.array(z.string()).optional(),
        internal_sound_dampening: z.object({
            foam_layers: z.string().optional(),
        }),
        switch_typing_experience: z.object({
            switch_type: z.string().optional(),
            hot_swappable: z.string().optional(),
            n_key_rollover: z.string().optional(),
            mounting_structure: z.string().optional(),
        }),
        connectivity_compatibility: z.object({
            modes: z.string().optional(),
            polling_rate: z.string().optional(),
            battery_capacity: z.string().optional(),
            compatible_systems: z.string().optional(),
        }),
    }),
})

type KeyboardFormValues = z.infer<typeof keyboardFormSchema>

export default function NewProductPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const productId = searchParams.get('id') as string | undefined;
    const [isLoading, setIsLoading] = useState(!!productId)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const [newFeature, setNewFeature] = useState('')
    const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    // New state for main image
    const [mainImageFile, setMainImageFile] = useState<File | null>(null)
    const [mainImagePreview, setMainImagePreview] = useState<string>('')
    const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([])

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
        reset
    } = useForm<KeyboardFormValues>({
        resolver: zodResolver(keyboardFormSchema),
        defaultValues: {
            title: '',
            price: 0,
            stock: 'inStock',
            quantity: 0,
            brand: '',
            description: '',
            warranty: '',
            weight: '',
            discount: 0,
            image: '',
            information: [{ feature: '', value: '' }],
            images: [],
            specifications: {
                general: {
                    color: '',
                    model: '',
                    layout: '',
                    keyboard_shell: '',
                    surface_finish: '',
                },
                keycaps: {
                    profile: '',
                    material: '',
                },
                plate_pcb: {
                    pcb: '',
                    plate_material: '',
                    quick_disassemble: 'No',
                },
                rgb_customization: {
                    backlight: '',
                    software_support: '',
                },
                additional_features: [],
                internal_sound_dampening: {
                    foam_layers: 'None',
                },
                switch_typing_experience: {
                    switch_type: '',
                    hot_swappable: '',
                    n_key_rollover: '',
                    mounting_structure: '',
                },
                connectivity_compatibility: {
                    modes: '',
                    polling_rate: '',
                    battery_capacity: '',
                    compatible_systems: '',
                }
            }
        }
    })

    // Function to upload a single file to Supabase Storage
    const uploadImageToSupabase = async (file: File, fileName: string): Promise<string> => {
        const supabase = await createClient()

        try {
            const { data, error } = await supabase.storage
                .from('keyboard-images')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                })

            if (error) throw error

            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
                .from('keyboard-images')
                .getPublicUrl(fileName)

            return publicUrl
        } catch (error) {
            console.error('Error uploading image:', error)
            throw new Error('Failed to upload image')
        }
    }

    // Function to handle main image selection
    const handleMainImageUpload = (file: File | null) => {
        if (file) {
            setMainImageFile(file)
            const previewUrl = URL.createObjectURL(file)
            setMainImagePreview(previewUrl)
        }
    }

    useEffect(() => {
        if (!productId) {
            setIsLoading(false);
            return;
        }

        const fetchProduct = async () => {
            const supabase = await createClient();
            setIsLoading(true);

            try {
                const { data: product, error } = await supabase
                    .from('keyboards')
                    .select('*')
                    .eq('id', productId)
                    .single();

                if (error) throw error;

                const defaultSpecs = {
                    general: {
                        color: '',
                        model: '',
                        layout: '',
                        keyboard_shell: '',
                        surface_finish: '',
                    },
                    keycaps: {
                        profile: '',
                        material: '',
                    },
                    plate_pcb: {
                        pcb: '',
                        plate_material: '',
                        quick_disassemble: 'No',
                    },
                    rgb_customization: {
                        backlight: '',
                        software_support: '',
                    },
                    additional_features: [],
                    internal_sound_dampening: {
                        foam_layers: 'None',
                    },
                    switch_typing_experience: {
                        switch_type: '',
                        hot_swappable: '',
                        n_key_rollover: '',
                        mounting_structure: '',
                    },
                    connectivity_compatibility: {
                        modes: '',
                        polling_rate: '',
                        battery_capacity: '',
                        compatible_systems: '',
                    }
                };

                // Reset form with fetched data or defaults
                reset({
                    title: product.title || '',
                    price: product.price || 0,
                    stock: product.stock || 'inStock',
                    quantity: product.quantity || 0,
                    brand: product.brand || '',
                    description: product.description || '',
                    warranty: product.warranty || '',
                    weight: product.weight || '',
                    discount: product.discount || 0,
                    image: product.image || '',
                    images: product.images || [],
                    information: product.information || [{ feature: '', value: '' }],
                    specifications: product.specifications || defaultSpecs
                });

                // Set preview images if available
                if (product.images?.length) {
                    setPreviewImages(product.images);
                }

                // Set main image preview if available
                if (product.image) {
                    setMainImagePreview(product.image);
                }

            } catch (error) {
                console.error('Error loading product:', error);
                toast.error('Failed to load product data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();

        return () => {
            // Cleanup object URLs
            if (mainImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(mainImagePreview);
            }
            previewImages.forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [productId, reset]);

    const { fields: infoFields, append: appendInfo, remove: removeInfo } = useFieldArray({
        control,
        name: 'information'
    })

    const currentImages = watch('images') || []
    const currentAdditionalFeatures = watch('specifications.additional_features') || []

    const handleImageUpload = (files: FileList | null) => {
        if (files) {
            const fileArray = Array.from(files)
            const remainingSlots = 5 - additionalImageFiles.length
            const filesToAdd = fileArray.slice(0, remainingSlots)

            const newImageUrls = filesToAdd.map(file => URL.createObjectURL(file))
            const updatedImages = [...previewImages, ...newImageUrls]
            const updatedFiles = [...additionalImageFiles, ...filesToAdd]

            setPreviewImages(updatedImages)
            setAdditionalImageFiles(updatedFiles)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const files = e.dataTransfer.files
        handleImageUpload(files)
    }

    const removeImage = (index: number) => {
        const newImages = [...previewImages]
        const newFiles = [...additionalImageFiles]

        // Revoke the object URL if it's a blob
        if (newImages[index].startsWith('blob:')) {
            URL.revokeObjectURL(newImages[index])
        }

        newImages.splice(index, 1)
        newFiles.splice(index, 1)

        setPreviewImages(newImages)
        setAdditionalImageFiles(newFiles)
    }

    const addInformationField = () => {
        appendInfo({ feature: '', value: '' })
    }

    const addAdditionalFeature = () => {
        if (newFeature.trim()) {
            setValue('specifications.additional_features', [...currentAdditionalFeatures, newFeature])
            setNewFeature('')
        }
    }

    const removeAdditionalFeature = (index: number) => {
        const newFeatures = [...currentAdditionalFeatures]
        newFeatures.splice(index, 1)
        setValue('specifications.additional_features', newFeatures)
    }

    const onSubmit = async (formData: KeyboardFormValues) => {
        setIsSubmitting(true);
        const supabase = await createClient();

        try {
            let mainImageUrl = formData.image || '';
            let additionalImageUrls: string[] = [];

            // Upload main image if a file was selected
            if (mainImageFile) {
                const mainImageFileName = `main-${Date.now()}-${mainImageFile.name}`;
                mainImageUrl = await uploadImageToSupabase(mainImageFile, mainImageFileName);
            }

            // Upload additional images
            if (additionalImageFiles.length > 0) {
                const uploadPromises = additionalImageFiles.map(async (file, index) => {
                    const fileName = `additional-${Date.now()}-${index}-${file.name}`;
                    return await uploadImageToSupabase(file, fileName);
                });

                additionalImageUrls = await Promise.all(uploadPromises);
            } else if (currentImages.length > 0) {
                // Keep existing images if no new files were uploaded
                additionalImageUrls = currentImages;
            }

            const finalFormData = {
                ...formData,
                image: mainImageUrl,
                images: additionalImageUrls
            };

            if (productId) {
                const { error } = await supabase
                    .from('keyboards')
                    .update(finalFormData)
                    .eq('id', productId);

                if (error) throw error;
                toast.success('Product updated successfully!');
            } else {
                const { error } = await supabase
                    .from('keyboards')
                    .insert(finalFormData);

                if (error) throw error;
                toast.success('Product created successfully!');
            }

            router.push('/dashboard/products');
            router.refresh();
        } catch (error) {
            toast.error(`Failed to ${productId ? 'update' : 'create'} product`);
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
        )
    }

    return (
        <div className="w-full p-6 bg-card rounded-lg shadow-sm border border-border">
            <h1 className="text-2xl font-semibold text-card-foreground mb-6">
                {productId ? 'Edit Keyboard' : 'Create New Keyboard'}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-muted-foreground">Title*</label>
                            <input
                                type="text"
                                {...register('title')}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-muted-foreground">Brand*</label>
                            <input
                                type="text"
                                {...register('brand')}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-muted-foreground">Price*</label>
                            <input
                                type="number"
                                {...register('price', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-muted-foreground">Quantity*</label>
                            <input
                                type="number"
                                {...register('quantity', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-muted-foreground">Stock</label>
                            <select
                                {...register('stock')}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="inStock">In Stock</option>
                                <option value="outOfStock">Out of Stock</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-muted-foreground">Discount (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                {...register('discount', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-muted-foreground">Warranty</label>
                            <input
                                type="text"
                                {...register('warranty')}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-muted-foreground">Weight (kg)</label>
                            <input
                                type="text"
                                {...register('weight')}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        {/* Updated Main Image Selection */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-muted-foreground">Main Image</label>
                            <div className="space-y-3">
                                <label className="block">
                                    <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-4 cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40">
                                        <div className="flex flex-col items-center gap-2">
                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                {mainImageFile ? mainImageFile.name : 'Click to select main image'}
                                            </span>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleMainImageUpload(e.target.files?.[0] || null)}
                                        className="hidden"
                                    />
                                </label>

                                {mainImagePreview && (
                                    <div className="relative">
                                        <img
                                            src={mainImagePreview}
                                            alt="Main image preview"
                                            className="h-40 w-full object-contain rounded border border-border bg-muted/10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (mainImagePreview.startsWith('blob:')) {
                                                    URL.revokeObjectURL(mainImagePreview);
                                                }
                                                setMainImagePreview('');
                                                setMainImageFile(null);
                                            }}
                                            className="absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full p-1"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Images */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-muted-foreground">Additional Images</label>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            {previewImages.length}/5 images
                        </span>
                    </div>

                    <div
                        className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${isDragOver
                            ? 'border-primary bg-primary/5 scale-[1.02]'
                            : 'border-border hover:border-primary/50 hover:bg-muted/20'
                            } ${previewImages.length >= 5 ? 'opacity-50 pointer-events-none' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="p-8 text-center">
                            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <Upload className={`h-8 w-8 transition-colors ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground">
                                    {isDragOver ? 'Drop images here!' : 'Drag & drop images here'}
                                </p>
                                <p className="text-xs text-muted-foreground">or click to browse files</p>
                                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                    <span>PNG, JPG, WebP up to 10MB</span>
                                    <span>•</span>
                                    <span>Max 5 images</span>
                                </div>
                            </div>

                            <label className="absolute inset-0 cursor-pointer">
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleImageUpload(e.target.files)}
                                    className="hidden"
                                    accept="image/*"
                                    disabled={previewImages.length >= 5}
                                />
                            </label>
                        </div>
                    </div>

                    {previewImages.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-foreground">Preview Images</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {previewImages.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <div className="relative overflow-hidden rounded-lg border border-border bg-muted/20 aspect-square">
                                            <img
                                                src={img}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                            />

                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedImagePreview(img)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 hover:bg-background text-foreground rounded-full p-2 shadow-lg"
                                                    title="Preview"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full p-2 shadow-lg"
                                                    title="Remove"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium shadow-lg">
                                            {index + 1}
                                        </div>
                                    </div>
                                ))}

                                {previewImages.length < 5 && (
                                    <label className="border-2 border-dashed border-border hover:border-primary/50 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors group bg-muted/20 hover:bg-muted/40">
                                        <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="text-xs text-muted-foreground mt-1">Add more</span>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={(e) => handleImageUpload(e.target.files)}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {selectedImagePreview && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImagePreview(null)}>
                        <div className="relative max-w-4xl max-h-full">
                            <img
                                src={selectedImagePreview}
                                alt="Full preview"
                                className="max-w-full max-h-full object-contain rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <button
                                onClick={() => setSelectedImagePreview(null)}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Description */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-muted-foreground">Description</label>
                    <textarea
                        {...register('description')}
                        rows={4}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                {/* Features */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-card-foreground">Features</h3>
                        <button
                            type="button"
                            onClick={addInformationField}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition"
                        >
                            + Add Feature
                        </button>
                    </div>
                    <div className="space-y-3">
                        {infoFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Feature"
                                    {...register(`information.${index}.feature`)}
                                    className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                <input
                                    type="text"
                                    placeholder="Value"
                                    {...register(`information.${index}.value`)}
                                    className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeInfo(index)}
                                    className="px-3 py-2 text-3xl text-destructive hover:text-destructive/80 transition"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {errors.information && (
                            <p className="text-sm text-destructive">
                                {errors.information.message || 'At least one feature is required'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Specifications */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-card-foreground border-b border-border pb-2">Specifications</h2>

                    {/* General Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 p-4 bg-muted/50 rounded-md border border-border">
                            <h3 className="font-medium text-foreground">General</h3>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Color</label>
                                    <input
                                        type="text"
                                        {...register('specifications.general.color')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Model</label>
                                    <input
                                        type="text"
                                        {...register('specifications.general.model')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Layout</label>
                                    <input
                                        type="text"
                                        {...register('specifications.general.layout')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Keyboard Shell</label>
                                    <input
                                        type="text"
                                        {...register('specifications.general.keyboard_shell')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Surface Finish</label>
                                    <input
                                        type="text"
                                        {...register('specifications.general.surface_finish')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Keycaps */}
                        <div className="space-y-3 p-4 bg-muted/50 rounded-md border border-border">
                            <h3 className="font-medium text-foreground">Keycaps</h3>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Profile</label>
                                    <input
                                        type="text"
                                        {...register('specifications.keycaps.profile')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Material</label>
                                    <input
                                        type="text"
                                        {...register('specifications.keycaps.material')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Plate & PCB */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 p-4 bg-muted/50 rounded-md border border-border">
                            <h3 className="font-medium text-foreground">Plate & PCB</h3>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">PCB Type</label>
                                    <input
                                        type="text"
                                        {...register('specifications.plate_pcb.pcb')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Plate Material</label>
                                    <input
                                        type="text"
                                        {...register('specifications.plate_pcb.plate_material')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Quick Disassemble</label>
                                    <select
                                        {...register('specifications.plate_pcb.quick_disassemble')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* RGB Customization */}
                        <div className="space-y-3 p-4 bg-muted/50 rounded-md border border-border">
                            <h3 className="font-medium text-foreground">RGB Customization</h3>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Backlight</label>
                                    <input
                                        type="text"
                                        {...register('specifications.rgb_customization.backlight')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Software Support</label>
                                    <input
                                        type="text"
                                        {...register('specifications.rgb_customization.software_support')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Features */}
                    <div className="space-y-3 p-4 bg-muted/50 rounded-md border border-border">
                        <h3 className="font-medium text-foreground">Additional Features</h3>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                placeholder="Add new feature"
                                className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <button
                                type="button"
                                onClick={addAdditionalFeature}
                                className="px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition"
                            >
                                Add
                            </button>
                        </div>
                        <div className="mt-2 space-y-1">
                            {currentAdditionalFeatures.map((feature, index) => (
                                <div key={index} className="flex items-center justify-between bg-background border border-border p-2 rounded">
                                    <span className="text-foreground">{feature}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeAdditionalFeature(index)}
                                        className="text-destructive hover:text-destructive/80"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Switch Typing Experience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 p-4 bg-muted/50 rounded-md border border-border">
                            <h3 className="font-medium text-foreground">Switch Typing Experience</h3>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Switch Type</label>
                                    <input
                                        type="text"
                                        {...register('specifications.switch_typing_experience.switch_type')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Hot Swappable</label>
                                    <input
                                        type="text"
                                        {...register('specifications.switch_typing_experience.hot_swappable')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">N-Key Rollover</label>
                                    <select
                                        {...register('specifications.switch_typing_experience.n_key_rollover')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Mounting Structure</label>
                                    <input
                                        type="text"
                                        {...register('specifications.switch_typing_experience.mounting_structure')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Connectivity & Compatibility */}
                        <div className="space-y-3 p-4 bg-muted/50 rounded-md border border-border">
                            <h3 className="font-medium text-foreground">Connectivity & Compatibility</h3>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Connection Modes</label>
                                    <input
                                        type="text"
                                        {...register('specifications.connectivity_compatibility.modes')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Polling Rate</label>
                                    <input
                                        type="text"
                                        {...register('specifications.connectivity_compatibility.polling_rate')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Battery Capacity</label>
                                    <input
                                        type="text"
                                        {...register('specifications.connectivity_compatibility.battery_capacity')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm text-muted-foreground">Compatible Systems</label>
                                    <input
                                        type="text"
                                        {...register('specifications.connectivity_compatibility.compatible_systems')}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Internal Sound Dampening */}
                    <div className="space-y-3 p-4 bg-muted/50 rounded-md border border-border">
                        <h3 className="font-medium text-foreground">Internal Sound Dampening</h3>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="block text-sm text-muted-foreground">Foam Layers</label>
                                <select
                                    {...register('specifications.internal_sound_dampening.foam_layers')}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="None">None</option>
                                    <option value="Single layer">Single layer</option>
                                    <option value="Multi-layer">Multi-layer</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        variant="default"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? productId ? 'Updating...' : 'Creating...'
                            : productId ? 'Update Product' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </div>
    )
}