"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin } from "lucide-react"

interface Coordinates {
    topLeft: { lat: string; lng: string }
    topRight: { lat: string; lng: string }
    bottomLeft: { lat: string; lng: string }
    bottomRight: { lat: string; lng: string }
}

interface SiteCoordinatesDialogProps {
    siteName: string
    coordinates: Coordinates
}

export function SiteCoordinatesDialog({ siteName, coordinates }: SiteCoordinatesDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                    View Coordinates
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <MapPin className="mr-2 h-5 w-5" />
                        {siteName} Coordinates
                    </DialogTitle>
                    <DialogDescription>Boundary coordinates for this site location</DialogDescription>
                </DialogHeader>
                <div className="mt-4 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Position</TableHead>
                                <TableHead>Latitude</TableHead>
                                <TableHead>Longitude</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Top Left</TableCell>
                                <TableCell>{coordinates.topLeft.lat}</TableCell>
                                <TableCell>{coordinates.topLeft.lng}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Top Right</TableCell>
                                <TableCell>{coordinates.topRight.lat}</TableCell>
                                <TableCell>{coordinates.topRight.lng}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Bottom Left</TableCell>
                                <TableCell>{coordinates.bottomLeft.lat}</TableCell>
                                <TableCell>{coordinates.bottomLeft.lng}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Bottom Right</TableCell>
                                <TableCell>{coordinates.bottomRight.lat}</TableCell>
                                <TableCell>{coordinates.bottomRight.lng}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )
}
