#!/usr/bin/env node

const isChinese = require('is-chinese');
const chalk = require('chalk');
const request = require('request');
const md5 = require('md5');
const ora = require('ora');
const log = console.log;

const data = process.argv[2];

if (data) {
  const spinner = ora('Querying').start();
  spinner.color = 'green';
  spinner.text = 'Querying';
  const state = isChinese(data);
  baiduFanyi(data, state, spinner)
} else {
  log('                                                     ');
  log(chalk.blue('  请输入查询的内容'));
  log('                                                     ');
}

function baiduFanyi(q, bool, spinner) {
  let from = '';
  let to = '';
  let salt = '123456';
  let appid = '20190510000296104';
  let sign = md5(appid + q + salt + 'FfIspV1K_e6zzvqeqibI');
  if (bool) {
    from = 'zh';
    to = 'en';
  } else {
    from = 'en';
    to = 'zh';
  }
  let options = {
    url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
    method: 'post',
    form: {
      q,
      from,
      to,
      appid,
      salt,
      sign
    }
  };
  request(options, (err, response, body) => {
    if (err) {
      log('查询出错');
    } else {
      spinner.succeed('Success in fanyi.baidu.com');
      spinner.stop();
      log('                                                     ');
      // log(JSON.parse(body).trans_result);
      log(chalk.green('  ' + JSON.parse(body).trans_result[0].dst))
      log('                                                     ');
    }
  })
}
