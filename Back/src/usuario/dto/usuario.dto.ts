export type UsuarioDto = {
    //      id  Int   @id @default(autoincrement())
    //   nome String
    //   email String @unique
    //   senha String
    //   role Boolean
    //   cargo String
    //   admMaster Boolean
    //   mediasrc String?
    //   denuncias Denuncia[]
    //   comentarios Comentario[]
    //   noticias Noticia[]
    //}

    id: number
    email: string
    senha: string
    role: boolean
    cargo: string
    admMaster: string
    mediasrc?: string
    denuncias: Denuncia[]
    comentarios: Comentario[]
    noticias: Noticia[]
    
}