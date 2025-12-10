import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryProvider } from './cloudinary.provider';
import 'multer';

// 1. Dizemos ao Jest para mockar (fingir) a biblioteca 'cloudinary'
jest.mock('cloudinary');

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    // 2. Configuração do módulo de teste
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        CloudinaryProvider, // Precisamos prover o token 'CLOUDINARY'
      ],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('deve fazer upload do arquivo com sucesso e retornar a URL', async () => {
      // CENÁRIO:
      // Criamos um arquivo falso (mock file)
      const mockFile: Express.Multer.File = {
        buffer: Buffer.from('imagem-falsa'),
        originalname: 'teste.jpg',
        fieldname: 'file',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        destination: '',
        filename: '',
        path: '',
        stream: null as any,
      };

      // O resultado que esperamos que o Cloudinary devolva
      const mockCloudinaryResponse = {
        secure_url: 'https://res.cloudinary.com/demo/image/upload/teste.jpg',
        public_id: 'teste',
        folder: 'MDS_Guardioes',
      };

      // MÁGICA DO MOCK:
      // Espionamos o método 'upload_stream' e forçamos ele a executar o callback de sucesso
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          // Simulamos que o Cloudinary terminou o serviço e chamou o callback com sucesso
          callback(null, mockCloudinaryResponse); 
          
          // Retornamos um objeto vazio só para o '.pipe()' não quebrar
          return { end: jest.fn(), write: jest.fn() };
        },
      );

      // AÇÃO:
      const result = await service.uploadImage(mockFile);

      // VERIFICAÇÃO:
      expect(result).toEqual(mockCloudinaryResponse);
      expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
    });

    it('deve lançar um erro se o upload falhar', async () => {
      const mockFile: Express.Multer.File = {
        buffer: Buffer.from('imagem-bugada'),
      } as Express.Multer.File;

      // Simulamos um erro no Cloudinary
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(new Error('Erro de conexão com Cloudinary'), null);
          return { end: jest.fn(), write: jest.fn() };
        },
      );

      // Esperamos que a chamada da função rejeite (lance erro)
      await expect(service.uploadImage(mockFile)).rejects.toThrow(
        'Erro de conexão com Cloudinary',
      );
    });

    it('deve lançar um erro específico se o Cloudinary não retornar erro nem resultado', async () => {
      const mockFile: Express.Multer.File = {
        buffer: Buffer.from('imagem-teste'),
      } as Express.Multer.File;

      // Simulamos o "limbo": sem erro, mas resultado undefined
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(undefined, undefined); 
          return { end: jest.fn(), write: jest.fn() };
        },
      );

      // Verificamos se ele lança exatamente o erro da linha 21
      await expect(service.uploadImage(mockFile)).rejects.toThrow(
        'Ocorreu um erro ao fazer o upload: Resposta vazia.',
      );
    });
  });
});