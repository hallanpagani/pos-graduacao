import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CriarRestauranteProdutoDTO } from './dto/criar-produtos.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { validateID } from 'src/helpers/validators';
import { Produto } from './schema/produto.schema';
//import { Restaurante } from 'src/restaurantes/schema/restaurante.schema';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectModel(Produto.name) private produtoModel: Model<Produto>, //@InjectModel('Restaurante') private restauranteModel: Model<Restaurante>,
  ) {}

  async criarProduto(
    restauranteID: string,
    produtoDTO: CriarRestauranteProdutoDTO,
  ) {
    const criarProduto = {
      ...produtoDTO,
      restauranteID: restauranteID,
    };

    return await this.produtoModel.create(criarProduto);

    /*const produtoCriado = await this.produtoModel.create(criarProduto);
    const restaurante = await this.restauranteModel.findById(restauranteID);
    const ExisteEsteProduto = restaurante.produtos.some(
      (elem) => elem['_id'] == produtoCriado.id,
    );
    if (!ExisteEsteProduto) {
      restaurante.produtos.push(produtoCriado);
      restaurante.save();
    }*/
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

  async deletarProdutodoRestaurante(
    restauranteID : string,
    produtoID : string){

    const produto = await this.produtoModel.findOneAndDelete({
        _id : produtoID,
        restaurantID: restauranteID,
    });
    //return await produto.deleteOne();
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
