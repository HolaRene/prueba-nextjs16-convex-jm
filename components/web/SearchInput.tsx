import { Loader2, Search } from "lucide-react"
import { Input } from "../ui/input"
import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"

const SearchInput = () => {
    const [term, setTerm] = useState("")
    const [abrir, setAbrir] = useState(false)

    const resultadosBusqueda = useQuery(api.blogs.busquedaPost, term.length > 2 ? { term, limit: 5 } : "skip")

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        // Lógica para manejar el cambio en el input de búsqueda
        setTerm(e.target.value)
        setAbrir(true)
    }
    return (
        <div className='relative w-full max-w-sm z-10'>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar Blog..."
                    className="w-full pl-8 bg-background"
                    value={term}
                    onChange={handleInputChange}
                />
            </div>
            {abrir && term.length > 2 && (
                <div className="absolute top-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                    {resultadosBusqueda === undefined ? (
                        <div className="flex gap-2 items-center p-4 text-sm text-muted-foreground">
                            <Loader2 className="animate-spin mr-2 size-4" />
                            Buscando...
                        </div>
                    ) : resultadosBusqueda.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground">No se encontraron resultados.</div>
                    ) : (
                        <div className="py-1">
                            {resultadosBusqueda.map((resultado) => (
                                <Link key={resultado._id} href={`/blogs/${resultado._id}`} className="flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                    onClick={() => {
                                        setAbrir(false)
                                        setTerm("")
                                    }}>
                                    <p className="font-medium truncate">{resultado.titulo}</p>
                                    <p className="text-xs text-muted-foreground pt-1">{resultado.cuerpo.substring(0, 10)}...</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchInput