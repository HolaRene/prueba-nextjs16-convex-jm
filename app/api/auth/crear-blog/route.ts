import { NextResponse } from "next/server"

export async function POST(){
    console.log('Hola desde mi post server')
    return NextResponse.json({message: 'Blog creado correctamente', success: true})
}