import { ForbiddenException } from '@nestjs/common';

it('Deve lançar ForbiddenException se usuário não for ADMINMASTER', async () => {
  const reqComum = { user: { tipo: TipoUsuario.COMUM } } as any;

  service.deletarCategorias = jest.fn().mockImplementation(() => {
    throw new ForbiddenException('Usuário não autorizado');
  });

  await expect(controller.deletarCategoria(1, reqComum)).rejects.toThrow(
    ForbiddenException,
  );
  expect(service.deletarCategorias).toHaveBeenCalledWith(1, reqComum.user.tipo);
});
