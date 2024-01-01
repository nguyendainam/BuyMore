import { handleGetRatingProduct } from "../services/product"


interface IComment {
    IdProduct: string,
    UserId: string,
    Start: number,
    Comment: string,
    UserName: string,
    date: string
}


export const getDataInforProduct = async (key: string) => {

    const dataResult = await handleGetRatingProduct(key)
    // console.log('sssssssss', dataResult.data.items)
    const startCount = [0, 0, 0, 0, 0]
    const ListComment: IComment[] = await dataResult.data.items?.map((item) => (
        {
            IdProduct: item.Id_Product,
            UserId: item.UserID,
            Start: item.StartRating,
            Comment: item.Comment,
            UserName: item.UserName,
            Date: item.CreatedAt
        }
    ))

    let totalStars = 0;
    let totalReviews = 0;

    if (ListComment.length) {
        ListComment.forEach(item => {
            const rating = item.Start;
            if (rating >= 1 && rating <= 5) {
                startCount[rating - 1]++
                totalStars += rating;
                totalReviews++;
            }
        })
    }

    const averageStars = totalReviews > 0 ? totalStars / totalReviews : 0;

    return {
        averageStars,
        startCount,
        ListComment
    }

}