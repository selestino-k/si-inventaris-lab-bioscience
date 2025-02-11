import { DataTable } from "@/components/ui/data-table";
import {columns, Instrumen} from "@/app/Instruments/columns";
import { instruments } from "./lib/data-instrument";


async function getData(): Promise<Instrumen[]> {
    // Fetch data from your API here.
    return instruments
  }

export default async function Beranda() {
    const data = await getData()
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-3 row-start-2 items-center sm:items-start">
                <h3 className="text-lg">
                    Selamat datang di
                </h3>
                <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
                SI Inventaris Lab Bioscience
                </h2>   
                <h3 className="text-lg">
                    Universitas Nusa Cendana
                </h3>            
                <div className="container mx-auto py-10">
                     <DataTable columns={columns} data={data} />
                </div>
            </main>
            
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

            </footer>
        </div>
    );
}

   
  