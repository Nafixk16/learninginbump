import {BASE_URL} from './config';

export async function promisePost(
  url = '',
  data = {},
  accessToken = null,
  method = null,
) {
  console.log('********** wait fetching *********');
  url = BASE_URL + url;
  const header = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    header['authorization'] = `Bearer ${accessToken}`;
  }
  console.log(accessToken);
  return await fetch(url, {
    method: method || 'POST',
    body: data,
    headers: header,
  })
    .then(res => {
      console.log('in then=> ', res);
      return res.json();
    })
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.log(error);
      return error;
    });
}

export async function postData(
  url = '',
  data = {},
  accessToken = null,
  method = null,
) {
  console.log('********** wait fetching *********');
  url = BASE_URL + url;
  const header = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    header['authorization'] = `Bearer ${accessToken}`;
  }
  const response = await fetch(url, {
    method: method || 'POST',
    headers: header,
    body: JSON.stringify(data),
  });
  console.log('postData=>', response);
  return response.json(); // parses JSON response into native JavaScript objects
}

export async function getData(url = '', accessToken = null) {
  console.log('********** wait get fetching *********');
  url = BASE_URL + url;

  const header = {
    'Content-Type': 'application/json',
    authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(url, {
    method: 'GET',
    headers: header,
  });
  console.log('getData=>', response);
  return response.json();
}
