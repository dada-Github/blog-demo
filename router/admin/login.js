const { User } = require('../../model/User');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {

    // 接受请求参数
    const { email, password } = req.body;

    // 判断用户有没有输入邮件地址和密码
    if (email.trim().length === 0 || password.trim().length === 0) {
        return res.status(400).send('<h4>邮件地址或密码错误</h4>');
    }

    // 根据邮箱地址查询用户信息
    // 如果查询到了用户 user变量的值是对象类型 对象中存储的是用户信息
    // 如果没有查询到用户 user变量为空
    let user = await User.findOne({ email });

    if (user) {
        // 查询到了用户
        // 将客户端传递过来的密码和用户信息中的密码进行比对
        let isEqual = await bcrypt.compare(password, user.password);
        if (isEqual) {
            // 登录成功

            // 将用户名存储在请求对象中
            req.session.username = user.username;

            // 将用户角色存储在session中
            req.session.role = user.role;

            // req.app===server返回true
            req.app.locals.userInfo = user;

            // 对用户角色进行判断
            if (user.role === 'admin') {
                // 重定向到用户列表页面
                res.redirect('/admin/user');
            } else {
                // 重定向到博客首页
                res.redirect('/home/');
            };
        } else {
            // 没有查询到用户
            res.status(400).send('<h4>邮件地址或密码错误</h4>');
        }
    } else {
        // 没有查询到用户
        res.status(400).send('<h4>邮件地址或密码错误</h4>');
    }
}