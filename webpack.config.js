/**
 * Created by tf on 2016/1/29.
 */
module.exports={
    entry:"./src/app.jsx",
    output:{
        path:"./public/js",
        filename:"app.js"
    },
    resolve:{
        extensions: ['', '.js', '.jsx']
    },
    module:{
        loaders:[
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
}
