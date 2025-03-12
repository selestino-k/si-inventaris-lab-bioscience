import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import prisma from "@/lib/prisma";
import { Instrumen } from "@prisma/client";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/inv-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


export const dynamic = 'force-dynamic'; // This ensures the page is not statically cached


async function getData(): Promise<Instrumen[]> {
    // Fetch data from your API here.
    return await prisma.instrumen.findMany()
}

export default async function DaftarInstrumen(
    {
    }: {
        searchParams: { refresh?: string }
    }
) {
    const data = await getData()
  
    return (
        <SidebarProvider>
        <AppSidebar/>
        <div className="grid w-full grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex w-full flex-col gap-3 row-start-2 items-center sm:items-start">
                <SidebarTrigger/>
                <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                Daftar Instrumen
                </h2>          
                <div className="container mx-auto py-10">
                    <SessionProvider>
                    <DataTable columns={columns} data={data} />
                    </SessionProvider>
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

            </footer>
        </div>
        </SidebarProvider>
    );
}
  
     
    