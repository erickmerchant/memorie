/* global fetch */

export default function (url) {
  return fetch(url).then(checkStatus).then(parseJSON)
}

function checkStatus (response) {
  if (response.status >= 200 && response.status < 400) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON (response) {
  return response.json()
}
