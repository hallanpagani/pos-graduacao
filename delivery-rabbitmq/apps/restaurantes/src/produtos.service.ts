import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CriarRestauranteProdutoDTO } from './dto/criar-produtos.dto';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { validateID } from '@app/comum/helpers/validator';
import { Produto, ProdutoDocument } from './schema/produto.schema';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectModel(Produto.name) private produtoModel: Model<ProdutoDocument>,
  ) {}

  async criarProduto(payload : any,
  ) {
    Logger.log(payload);
    return await this.produtoModel.create(payload);
  }

  async buscarProdutosDoRestaurante(
    restauranteID,
    produtoID?,
  ): Promise<Produto[]> {
    if (produtoID) {
      validateID(produtoID);
      return await this.produtoModel.find({
        _id: produtoID,
        restaurantID: restauranteID,
      });
    }
    return await this.produtoModel.find({ restauranteID: restauranteID });
  }

  async atualizarProduto(
    produtoID: string,
    produtoDTO: CriarRestauranteProdutoDTO,
  ) {
    validateID(produtoID);
    const produto = await this.produtoModel.findById(produtoID);
    if (!produto) {
      throw new HttpException('Produto não encontrado.', HttpStatus.NOT_FOUND);
    }

    await produto.updateOne(produtoDTO);
    return await this.produtoModel
      .findById(produtoID)
      .populate('restauranteID');
  }

  async deletarProdutodoRestaurante(restauranteID: string, produtoID: string) {
    const produto = await this.produtoModel.findOneAndDelete({
      _id: produtoID,
      restaurantID: restauranteID,
    });
    return produto;
  }

  async validarProdutosParaOMesmoRestaurante(produtos, restauranteID: string) {
    for (const [oProduto] of produtos.entries()) {
      await validateID(oProduto.produto);
      const produto = await this.produtoModel.findById(oProduto.produto);

      if (!produto || produto.restauranteID._id.toString() != restauranteID) {
        return false;
      }
    }
    return true;
  }
}
