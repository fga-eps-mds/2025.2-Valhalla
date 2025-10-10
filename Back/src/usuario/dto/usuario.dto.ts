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
    nome: string
    email: string
    senha: string
    cargo: string
    mediasrc?: string
    //denuncias: Denuncia[]
    //comentarios: Comentario[]
    //noticias: Noticia[]

}