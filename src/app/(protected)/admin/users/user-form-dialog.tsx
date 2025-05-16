"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { z } from "zod"

import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ApiService } from "@/api/api-service"
import { ApiEndpoints } from "@/api/endpoints"
import { SiteLocation } from "@/app/(auth)/login/page"
import { UserFormContent } from "./user-form-content"
import { UserFormProps } from "./user-form"

export function UserFormDialog({
    open,
    setOpen,
    mode,
    userToEdit,
    onUserSaved,
}: UserFormProps & { open: boolean, setOpen: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Tambahkan User Baru" : "Edit User"}</DialogTitle>
                    <DialogDescription>
                        {mode === "add" ? "Isi form untuk menambahkan user baru." : "Edit data user."}
                    </DialogDescription>
                </DialogHeader>
                <UserFormContent
                    mode={mode}
                    userToEdit={userToEdit}
                    onUserSaved={onUserSaved}
                    setOpen={setOpen}
                />
            </DialogContent>
        </Dialog>
    )
}
