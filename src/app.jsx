import React from "react"
import ReactDOM from "react-dom"
import WebUploader from "tb-webuploader/dist/webuploader.js"
class App extends React.Component {
    constructor(props) {
        super(props)
    }
    uploader() {
    }
    componentDidMount() {
        WebUploader.Uploader.register({
            'before-send': 'beforeSend'
        }, {
            beforeSend: block=> {
                var deferred = WebUploader.Base.Deferred()
                $.ajax({
                    type:"GET",
                    url:"/files/chunk",
                    data:{
                            chunk:block.chunk,
                            chunks:block.chunks,
                            fileName:block.file.name
                    },
                    success:res=>{
                        console.log(res)
                        if(res.err){
                           deferred.reject()
                        }
                        else{
                            deferred.resolve()
                        }
                    }
                })
                return deferred.promise();
            }

        })
        this.uploader=WebUploader.create({
            swf: '/js/Uploader.swf',
            server: '/files',
            pick: '#picker',
            resize: false,
            chunked: true,
            threads: 1
        })
            .on("fileQueued", file=> {
                this.uploader.md5File(file)
                    .progress(function (percentage) {
                        console.log('Percentage:', percentage);
                    })
                    .then(md5=>{
                        $.ajax({
                            type:"GET",
                            url:"/files/md5/"+md5,
                            success:res=>{
                                console.log(res)
                                if(res.err) this.uploader.skipFile(file)
                                else this.uploader.upload()
                            }
                        })
                    });
            })
            .on("uploadProgress",(file,precent)=>{
               console.log(precent)
            })
            .on( 'uploadSuccess', function( file ) {
               console.log("已上传")
            })
    }
    render() {
        return  <div id="uploader" className="wu-example">
                   <div id="thelist" className="uploader-list"></div>
                   <div className="btns">
                        <div id="picker">选择文件</div>
                   </div>
                </div>
    }
}
ReactDOM.render(<App/>, document.getElementById('content'))
