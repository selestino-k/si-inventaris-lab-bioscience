"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteInstrument } from "@/lib/actions"

// This type is used to define the shape of our data.
export type Instrumen = {
    instrument_id: number
    merk_instrumen: string
    nama_instrumen: string
    tipe_instrumen: string
    rentals: string
    layanan: string
    status: string
    updatedAt: Date
}

export const columns: ColumnDef<Instrumen>[] = [
 {
    accessorKey: "instrument_id",
    header: "ID",
  },
  {
    accessorKey: "merk_instrumen",
    header: "Merk",
  },
  {
    accessorKey: "nama_instrumen",
    header: "Nama",
  },
  {
    accessorKey: "tipe_instrumen",
    header: "Tipe",
  },
  {
    accessorKey: "layanan",
    header: "Layanan",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block
          ${status === 'TERSEDIA' ? 'bg-green-100 text-green-800' : 
            status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
          {status}
        </div>
      )
    }
  },
  {
    accessorKey: "rentals",
    header: "Pengguna sekarang",
    cell: ({ row }) => {
      const rentals = row.getValue("rentals") as Rental[]
      const activeRental = Array.isArray(rentals) ? 
      rentals.find(rental => rental.status === 'ACTIVE' && !rental.end_date) : null
    
      return activeRental ? activeRental.user_email : "Tidak ada"
    }
  },

  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const instrument = row.original
      
      // Create a component to use React hooks
      function ActionCell() {
        const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
        const [isDeleting, setIsDeleting] = useState(false)

        const handleDelete = async () => {
          try {
            setIsDeleting(true)
            // Replace with your actual delete function
            await deleteInstrument(instrument.instrument_id)
            toast.success("Instrumen berhasil dihapus")
            // Refresh the page to update the table
            window.location.reload()
          } catch (error) {
            console.error("Failed to delete instrument:", error)
            toast.error("Gagal menghapus instrumen")
          } finally {
            setIsDeleting(false)
            setIsDeleteDialogOpen(false)
          }
        }
        
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/daftar-instrumen/${instrument.instrument_id}/detail`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Detail
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/daftar-instrumen/${instrument.instrument_id}/edit`}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus instrumen "{instrument.nama_instrumen}" secara permanen dan tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete()
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Menghapus..." : "Hapus"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )
      }

      return <ActionCell />;
    }
  },
]
