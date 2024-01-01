import { getImageCarousel } from '../services/product'


export interface IImageCarousel {
  Id: number,
  Image: string ,
  IsShow: boolean ,
  type: string
}

export const ImageCarousel = async (key: string) => {

  let keyImg = key
  if (!key) {
    keyImg = 'All'
  }
  const result = await getImageCarousel(keyImg)
  const arrImage: IImageCarousel[] = result.data.items.map(i => ({
    Id: i.Id,
    Image: i.Image,
    IsShow: i.IsShow ,
    type: i.TypeImage
  }))

  return arrImage
}
