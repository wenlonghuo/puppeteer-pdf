<template>
  <section class="home">
    <h1>网页链接自动生成 PDF</h1>

    <section class="online">
      <h2>单个网页导出为 PDF</h2>
      <section class="info">
        <p>
          导出参数：
        </p>
        <p>
          请求地址: GET -> /pdf/create/download
        </p>
        <h4>请求参数</h4>
        <p>
          <b>url: </b>要导出的地址
        </p>
        <p>
          <b>cookie: </b>附加 cookie
        </p>
        <p>
          <b>pdfOptions: </b>PDF 页面设置
        </p>
      </section>
      <section class="single-wrapper">
        <h3>在线示例：</h3>
        <div class="input-item">
          <label for="">url</label>
          <input
            v-model="single.url"
            type="text" placeholder="请输入 URL"/>
        </div>

        <div class="input-item">
          <label for="">cookie (选填)</label>
          <input
            v-model="single.cookie"
            type="text" placeholder="请输入 cookie"/>
        </div>

        <div class="input-item">
          <label for="">页面参数(JSON, 选填)</label>
          <input
            v-model="single.pdfOptions"
            type="text" placeholder="请输入页面配置"/>
        </div>

        <button
          class="btn btn-primary"
          @click="handleClickSingle">导出PDF</button>
      </section>
    </section>

    <section class="online">
      <h2>多个网页导出为 PDF</h2>
      <section class="info">
        <p>
          导出参数：
        </p>
        <p>
          请求地址: POST -> /pdf/create/files
        </p>
        <h4>请求参数</h4>
        <p>
          <b>list: </b>要导出的列表，类型与单个格式相同
        </p>
        <p>
          <b>cookie: </b>附加 cookie
        </p>
        <p>
          <b>pdfOptions: </b>PDF 页面设置
        </p>
      </section>
      <section class="mulit-wrapper">
        <h3>在线示例：</h3>

        <div class="input-item">
          <label for="">cookie (选填)</label>
          <input
            v-model="multi.cookie"
            type="text" placeholder="请输入 cookie"/>
        </div>

        <div class="input-item">
          <label for="">页面参数(JSON, 选填)</label>
          <input
            v-model="multi.pdfOptions"
            type="text" placeholder="请输入页面配置"/>
        </div>
        <div class="input-item">
          <label for="">URL</label>
          <textarea
            v-model="multi.list"
            cols="100"
            rows="4"
            placeholder="请输入页面URL，以逗号分隔"/>
        </div>

        <button
          class="btn btn-primary"
          @click="handleClickMulti">导出合并的PDF</button>
      </section>
    </section>

    <section class="online">
      <h2>代码示例</h2>
      <p>axios 请求下载文件示例：</p>
      <pre>
        <code lang="javascript">
          axios.post('/pdf/create/files', {
            list: multi.list.split(',').map(item => ({ url: item })),
            cookie: multi.cookie,
            pdfOptions: multi.pdfOptions
          }, {
            responseType: 'arraybuffer'
          }).then(res => {
            this.createDownload(res.data)
          })
        </code>
      </pre>
      <p>下载文件：</p>
      <pre>
        <code lang="javascript">
          createDownload (text, filename = '导出') {
            /* eslint-disable no-undef */
            const blob = new Blob([text], { type: 'application/pdf' })
            const elink = document.createElement('a')
            elink.download = filename + '.pdf'
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          }
        </code>
      </pre>
    </section>

  </section>
</template>

<script>
import axios from 'axios'
export default {
  name: 'home',
  data () {
    return {
      single: {
        url: '',
        cookie: '',
        pdfOptions: ''
      },
      multi: {
        list: '',
        cookie: '',
        pdfOptions: ''
      }
    }
  },
  methods: {
    handleClickSingle () {
      const single = this.single
      axios.get('/pdf/create/download', {
        params: {
          url: single.url,
          cookie: single.cookie,
          pdfOptions: single.pdfOptions
        },
        responseType: 'arraybuffer'
      }).then(res => {
        this.createDownload(res.data)
      })
    },
    handleClickMulti () {
      const multi = this.multi
      axios.post('/pdf/create/files', {
        list: multi.list.split(',').map(item => ({ url: item })),
        cookie: multi.cookie,
        pdfOptions: multi.pdfOptions
      }, {
        responseType: 'arraybuffer'
      }).then(res => {
        this.createDownload(res.data)
      })
    },
    createDownload (text, filename = '导出') {
      /* eslint-disable no-undef */
      const blob = new Blob([text], { type: 'application/pdf' })
      const elink = document.createElement('a')
      elink.download = filename + '.pdf'
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    }
  }
}
</script>

<style>
h1 {
  text-align: center;
}
.home {
  text-align: left;
  padding: 20px;
}
.online {
  margin-bottom: 20px;
  border-top: 1px solid #999;
}
.info {
  padding: 14px 20px;
}
.single-wrapper {
  padding: 14px 15px;
}
.input-item input, .input-item textarea {
  width: 100%;
  border: 1px solid #efefef;
  line-height: 1.5;
  padding: 10px 5px;
  box-sizing: border-box;
}

.input-item {
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 5px;
}
.input-item>label {
  width: 15em;
  text-align: right;
  margin-right: 10px;
}
</style>
