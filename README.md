# com.yt.mall.app.slb 

## Project setup 
``` yarn install ``` 

### Compiles and hot-reloads for development 
``` yarn serve``` 

### Compiles and minifies for production 
``` yarn build ``` 

### Lints and fixes files 
```yarn lint ``` 

### Customize configuration See [Configuration Reference](https://cli.vuejs.org/config/). 

### 如果要ts支持 import module = require(“module”) 形式，要修改 tsconfig.json文件中的 “module": "commonjs", 且export = {} 

### 用@vueuse/core,版本用6.0.0的，高版本有问题


### 關於apis裏的model
- Model表示請求參數的約束; Item(info)表示返回數據中單條記錄的信息；Res表示對照接口返回數據的約束。
    因接口的不同，並不是三個約束要同時存在。如果有，會從上到下，將同一個接口的相應約束寫在一起
