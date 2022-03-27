const { TwitterApi } = require('twitter-api-v2');
const dotenv = require('dotenv');



dotenv.config({ path: './config.env' })

const userClient = new TwitterApi(process.env.BEARER_TOKEN);

const v1UserClient = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_KEY_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
  });

const myClient = userClient.readWrite;
const myv1Client = v1UserClient.readWrite;

const getUserIdByUserName = async (username) => {
   
    const user = await myClient.v2.userByUsername(username);

    const myTweets = await myClient.v2.userTimeline(`${user.data.id}`, {
        max_results: 10,
        exclude:['replies', 'retweets']
    })

    console.log(myTweets.data)
    console.log(user.data.id)
}

const tweet = async (tweet) => {
    const {data} = await myv1Client.v2.tweet(tweet);

    console.log(`Tweet ${data.id} : ${data.text}`)
}

const reply = async (id, text) => {
    const { data } = await myv1Client.v2.reply(text, id);

    console.log(data)
}

const likeAndRetweetIrenTweets = async () => {
    const irenSaidTweets = await myClient.v2.search('#pstirensaid', {
        max_results: 30,

    });
    const pastey = await  myClient.v2.userByUsername('pst_iren')
    const pasteysTweets = await myClient.v2.userTimeline(`${pastey.data.id}`, {
        max_results: 20,
        exclude: ['replies', 'retweets']
    })
    pasteysTweets.data.data.forEach(async tweet => {
        await myv1Client.v2.like('1490656975742541829', tweet.id)
        await myv1Client.v2.retweet('1490656975742541829', tweet.id)
    });

    irenSaidTweets.data.data.forEach(async tweet => {
        await myv1Client.v2.like('1490656975742541829', tweet.id)
        await myv1Client.v2.retweet('1490656975742541829', tweet.id)
    })
}

likeAndRetweetIrenTweets()