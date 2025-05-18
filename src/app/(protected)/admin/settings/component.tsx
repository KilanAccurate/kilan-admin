"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Plus, Trash2, Upload, ImageIcon, X } from "lucide-react"
import { SiteCoordinatesDialog } from "@/components/site-coordinate-dialog"

interface SiteLocation {
    id: string
    siteName: string
    city: string
    coordinates: {
        topLeft: { lat: string; lng: string }
        topRight: { lat: string; lng: string }
        bottomLeft: { lat: string; lng: string }
        bottomRight: { lat: string; lng: string }
    }
}

interface UploadedImage {
    id: string
    name: string
    url: string
    size: number
}

export default function SiteManagementPage() {
    const [sites, setSites] = useState<SiteLocation[]>([])

    // useEffect(() => {
    //     const fetchSites = async () => {
    //         try {
    //             const response = await fetch("/api/sites"); // adjust the endpoint accordingly
    //             const data = await response.json();

    //             const transformed = data.map((site: { sitePolygon: [any, any, any, any]; _id: any; id: any; siteName: any; city: any }) => {
    //                 const [topLeft, topRight, bottomRight, bottomLeft] = site.sitePolygon;

    //                 return {
    //                     id: site._id || site.id, // ensure backend returns unique identifier
    //                     siteName: site.siteName,
    //                     city: site.city || "-", // fallback if `city` isn't provided
    //                     coordinates: {
    //                         topLeft,
    //                         topRight,
    //                         bottomLeft,
    //                         bottomRight,
    //                     },
    //                 };
    //             });

    //             setSites(transformed);
    //         } catch (error) {
    //             console.error("Failed to fetch sites:", error);
    //         }
    //     };

    //     fetchSites();
    // }, []);
    const [formData, setFormData] = useState<Omit<SiteLocation, "id">>({
        siteName: "",
        city: "",
        coordinates: {
            topLeft: { lat: "", lng: "" },
            topRight: { lat: "", lng: "" },
            bottomLeft: { lat: "", lng: "" },
            bottomRight: { lat: "", lng: "" },
        },
    })

    const [images, setImages] = useState<UploadedImage[]>([])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (name === "siteName" || name === "city") {
            setFormData({ ...formData, [name]: value })
        } else {
            // Handle coordinate fields
            const [position, coord, field] = name.split(".")
            setFormData({
                ...formData,
                coordinates: {
                    ...formData.coordinates,
                    [position]: {
                        ...formData.coordinates[position as keyof typeof formData.coordinates],
                        [coord]: value,
                    },
                },
            })
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form
        if (!formData.siteName || !formData.city) {
            alert("Please fill in site name and city")
            return
        }

        // Add new site
        const newSite: SiteLocation = {
            ...formData,
            id: Date.now().toString(),
        }

        setSites([...sites, newSite])

        // Reset form
        setFormData({
            siteName: "",
            city: "",
            coordinates: {
                topLeft: { lat: "", lng: "" },
                topRight: { lat: "", lng: "" },
                bottomLeft: { lat: "", lng: "" },
                bottomRight: { lat: "", lng: "" },
            },
        })
    }

    const deleteSite = (id: string) => {
        setSites(sites.filter((site) => site.id !== id))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const newImages: UploadedImage[] = []

        Array.from(files).forEach((file) => {
            // Only accept image files
            if (!file.type.startsWith("image/")) {
                alert(`File ${file.name} is not an image`)
                return
            }

            // Create a URL for the image
            const imageUrl = URL.createObjectURL(file)

            newImages.push({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: file.name,
                url: imageUrl,
                size: file.size,
            })
        })

        setImages((prevImages) => [...prevImages, ...newImages])

        // Reset the input
        e.target.value = ""
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()

        const files = e.dataTransfer.files
        if (!files || files.length === 0) return

        const newImages: UploadedImage[] = []

        Array.from(files).forEach((file) => {
            // Only accept image files
            if (!file.type.startsWith("image/")) {
                alert(`File ${file.name} is not an image`)
                return
            }

            // Create a URL for the image
            const imageUrl = URL.createObjectURL(file)

            newImages.push({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: file.name,
                url: imageUrl,
                size: file.size,
            })
        })

        setImages((prevImages) => [...prevImages, ...newImages])
    }

    const deleteImage = (id: string) => {
        setImages((prevImages) => {
            const imageToDelete = prevImages.find((img) => img.id === id)
            if (imageToDelete) {
                // Revoke the object URL to free up memory
                URL.revokeObjectURL(imageToDelete.url)
            }
            return prevImages.filter((img) => img.id !== id)
        })
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + " bytes"
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
        else return (bytes / 1048576).toFixed(1) + " MB"
    }

    return (
        <div className="container mx-auto py-8">
            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Site</CardTitle>
                        <CardDescription>Enter site details and boundary coordinates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Site Name</Label>
                                    <Input
                                        id="siteName"
                                        name="siteName"
                                        value={formData.siteName}
                                        onChange={handleInputChange}
                                        placeholder="Enter site name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter city"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Coordinates</h3>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <Card className="p-4">
                                        <div className="mb-2 font-medium">Top Left</div>
                                        <div className="grid gap-2 md:grid-cols-2">
                                            <div>
                                                <Label htmlFor="topLeft.lat">Latitude</Label>
                                                <Input
                                                    id="topLeft.lat"
                                                    name="topLeft.lat"
                                                    value={formData.coordinates.topLeft.lat}
                                                    onChange={handleInputChange}
                                                    placeholder="Latitude"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="topLeft.lng">Longitude</Label>
                                                <Input
                                                    id="topLeft.lng"
                                                    name="topLeft.lng"
                                                    value={formData.coordinates.topLeft.lng}
                                                    onChange={handleInputChange}
                                                    placeholder="Longitude"
                                                />
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-4">
                                        <div className="mb-2 font-medium">Top Right</div>
                                        <div className="grid gap-2 md:grid-cols-2">
                                            <div>
                                                <Label htmlFor="topRight.lat">Latitude</Label>
                                                <Input
                                                    id="topRight.lat"
                                                    name="topRight.lat"
                                                    value={formData.coordinates.topRight.lat}
                                                    onChange={handleInputChange}
                                                    placeholder="Latitude"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="topRight.lng">Longitude</Label>
                                                <Input
                                                    id="topRight.lng"
                                                    name="topRight.lng"
                                                    value={formData.coordinates.topRight.lng}
                                                    onChange={handleInputChange}
                                                    placeholder="Longitude"
                                                />
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-4">
                                        <div className="mb-2 font-medium">Bottom Left</div>
                                        <div className="grid gap-2 md:grid-cols-2">
                                            <div>
                                                <Label htmlFor="bottomLeft.lat">Latitude</Label>
                                                <Input
                                                    id="bottomLeft.lat"
                                                    name="bottomLeft.lat"
                                                    value={formData.coordinates.bottomLeft.lat}
                                                    onChange={handleInputChange}
                                                    placeholder="Latitude"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="bottomLeft.lng">Longitude</Label>
                                                <Input
                                                    id="bottomLeft.lng"
                                                    name="bottomLeft.lng"
                                                    value={formData.coordinates.bottomLeft.lng}
                                                    onChange={handleInputChange}
                                                    placeholder="Longitude"
                                                />
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-4">
                                        <div className="mb-2 font-medium">Bottom Right</div>
                                        <div className="grid gap-2 md:grid-cols-2">
                                            <div>
                                                <Label htmlFor="bottomRight.lat">Latitude</Label>
                                                <Input
                                                    id="bottomRight.lat"
                                                    name="bottomRight.lat"
                                                    value={formData.coordinates.bottomRight.lat}
                                                    onChange={handleInputChange}
                                                    placeholder="Latitude"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="bottomRight.lng">Longitude</Label>
                                                <Input
                                                    id="bottomRight.lng"
                                                    name="bottomRight.lng"
                                                    value={formData.coordinates.bottomRight.lng}
                                                    onChange={handleInputChange}
                                                    placeholder="Longitude"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <Button type="submit" className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Site
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Registered Sites</CardTitle>
                        <CardDescription>List of all registered site locations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sites.length === 0 ? (
                            <div className="flex h-40 items-center justify-center rounded-md border border-dashed p-8 text-center">
                                <div>
                                    <MapPin className="mx-auto h-10 w-10 text-muted-foreground" />
                                    <h3 className="mt-2 text-lg font-semibold">No sites registered</h3>
                                    <p className="text-sm text-muted-foreground">Add your first site using the form</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Site Name</TableHead>
                                            <TableHead>City</TableHead>
                                            <TableHead>Coordinates</TableHead>
                                            <TableHead className="w-[80px]">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sites.map((site) => (
                                            <TableRow key={site.id}>
                                                <TableCell className="font-medium">{site.siteName}</TableCell>
                                                <TableCell>{site.city}</TableCell>
                                                <TableCell>
                                                    <SiteCoordinatesDialog siteName={site.siteName} coordinates={site.coordinates} />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive"
                                                        onClick={() => deleteSite(site.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Image Uploader Section */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Image Gallery</CardTitle>
                    <CardDescription>Upload and manage site images</CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className="mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                        <p className="mb-2 text-sm font-medium">Drag and drop images here or click to browse</p>
                        <p className="mb-4 text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF</p>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                        <Button variant="outline" onClick={() => document.getElementById("image-upload")?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Images
                        </Button>
                    </div>

                    {images.length === 0 ? (
                        <div className="flex h-40 items-center justify-center rounded-md border border-dashed p-8 text-center">
                            <div>
                                <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
                                <h3 className="mt-2 text-lg font-semibold">No images uploaded</h3>
                                <p className="text-sm text-muted-foreground">Upload images using the form above</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="mb-4 text-lg font-medium">Uploaded Images ({images.length})</h3>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {images.map((image) => (
                                    <div key={image.id} className="group relative overflow-hidden rounded-lg border">
                                        <div className="aspect-square w-full overflow-hidden">
                                            <img
                                                src={image.url || "/placeholder.svg"}
                                                alt={image.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="ml-auto h-7 w-7 self-start"
                                                onClick={() => deleteImage(image.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            <div className="bg-black/60 p-2 text-xs text-white">
                                                <p className="truncate font-medium">{image.name}</p>
                                                <p className="text-xs text-gray-300">{formatFileSize(image.size)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
