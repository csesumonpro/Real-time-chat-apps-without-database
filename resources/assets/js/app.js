
require('./bootstrap');
// use For vue js library
import Vue from 'vue'

// Fot Auto Chat Scorll
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

//  For Notification
import Toaster from 'v-toaster'
Vue.use(Toaster, {timeout: 5000})
import 'v-toaster/dist/v-toaster.css'

Vue.component('example-component', require('./components/ExampleComponent.vue'));
Vue.component('message', require('./components/MessageComponent.vue'));

const app = new Vue({
    el: '#app',
    data:{
        message:'',
        chat:{
            message:[],
            user:[],
            color:[],
            time:[],
        },
        typing:'',
        numOfUser:0
    },
    watch:{
        message(){
            Echo.private('chat')
            .whisper('typing', {
                name: this.message
            });
        }
    },
    methods:{
        send(){
           if(this.message.length!='0'){
           this.chat.message.push(this.message);
           this.chat.time.push(this.getTime());
           this.chat.color.push("success");
           this.chat.user.push("you");
           
           axios.post('send', {
            message:this.message,
            chat:this.chat
          })
          .then(response=> {
            console.log(response);
            this.message=''
          })
          .catch(error=> {
            console.log(error);
          });
           }
        },
        getTime(){
            let time = new Date();
            return time.getHours()+":"+time.getMinutes();
        },
        getOldMessage(){
            axios.post('getOldMessage')
              .then(response=> {
                console.log(response);
                if(response.data!=""){
                    this.chat=response.data;
                }
              })
              .catch(error=> {
                console.log(error);
              });
        },
        deleteSession(){
            axios.post('deleteSession')
            .then(response=> this.$toaster.success('Chat history is deleted') );
        },
      
    },
    mounted(){
        this.getOldMessage();
        Echo.private('chat')   //chanel change it to private because it private
    .listen('ChatEvent', (e) => {
        this.chat.message.push(e.message);
        this.chat.user.push(e.user);
        this.chat.color.push("danger");
        this.chat.time.push(this.getTime());
        axios.post('saveToSession',{
            chat:this.chat
        })
        .then(response=> {
         
        })
        .catch(error=> {
          console.log(error);
        });
    })
    .listenForWhisper('typing', (e) => {
        if(e.name!=''){
            this.typing="Typing...";
        }else{
            this.typing="";
        }
    });
    Echo.join(`chat`)
    .here((users) => {
       this.numOfUser = users.length;
    })
    .joining((user) => {
        this.numOfUser += 1;
        this.$toaster.success(user.name+' Join Now.', {timeout: 8000})

    })
    .leaving((user) => {
        this.numOfUser -= 1;
        this.$toaster.warning(user.name+' Leave Now.', {timeout: 8000})
    });
    },
    
});
