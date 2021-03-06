const { Article } = require('../../model/Article');
const { Comment } = require('../../model/Comment');

module.exports = async (req, res) => {
    // 接收客户端传递来文章id的值
    const { id } = req.query;

    // 根据id查询文章详细信息
    let article = await Article.findOne({ _id: id }).populate('author');

    // 查询文章对应的评论信息
    let comments = await Comment.find({ aid: id }).populate('uid');

    // 注
    article = JSON.parse(JSON.stringify(article));
    comments =  JSON.parse(JSON.stringify(comments));
    
    res.render('home/article', {
        article,
        comments,
    });
};