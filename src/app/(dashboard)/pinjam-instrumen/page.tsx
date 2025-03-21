import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import prisma from "@/lib/prisma";
import { Instrumen } from "@prisma/client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

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
    const session = await auth();
    if (!session) redirect ('/sign-in');
    
    
    
    return (
        <div className="grid w-full grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex w-full flex-col gap-3 row-start-2 items-center sm:items-start">
                <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                Daftar Instrumen
                </h2>          
                <div className="container mx-auto py-10">
                    <SessionProvider>
                    <p>Pinjam sebagai : {session.user?.email}</p>
                    <DataTable columns={columns} data={data} />
                    </SessionProvider>
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

            </footer>
        </div>
    );
}
  
     
    