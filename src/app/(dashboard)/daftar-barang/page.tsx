import { DataTable } from "@/components/ui/data-table";
import {columns} from "./columns";
import prisma from "@/lib/prisma";
import {Barang} from "@prisma/client";

const barang = await prisma.barang.findMany()


async function getData(): Promise<Barang[]> {
    // Fetch data from your API here.
    return barang
}

export default async function DaftarBarang() {
    const data = await getData()
    

    return (
        <div className="grid w-full grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex w-full flex-col gap-3 row-start-2 items-center sm:items-start">
                <div className="mb-4 sm:hidden items-start">
                </div>
                <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                Daftar Barang
                </h2>          
                <div className="container mx-auto py-10">
                    <DataTable columns={columns} data={data} />
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

            </footer>
        </div>

    );
}
  
     
    