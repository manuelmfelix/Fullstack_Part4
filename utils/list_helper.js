const _ = require('lodash')

const dummy = (blogs) => {
  return blogs.length === 0
    ? 1
    : 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item['likes']
  }
  return blogs.reduce(reducer,0)
}

const maxLikes = (blogs) => {
  const reducer = (acc, val) => {
    acc = (acc === 0 || val['likes'] > acc ) ? val['likes'] : acc
    return acc
  }
  return blogs.reduce(reducer,0)
}

const mostBlogs = (blogs) => {
  const reducer = (acc,val) => {
    acc.push(val['author'])
    return acc
  }
  const authors = blogs.reduce(reducer,[])
  console.log(authors)
  const author = _.head(_(authors)
    .countBy()
    .entries()
    .maxBy(_.last))

  console.log(author)
  const count = authors.reduce((acc,val) => {val === author ? acc=acc+1 : acc; return acc},0)

  return { author: author,
    blogs: count }
}

const mostLikes = (blogs) => {
  const max = maxLikes(blogs)
  const reducer = (acc, val) => {
    if (val['likes'] === max){
      acc = {
        author: val['author'],
        likes: val['likes']
      }
    }
    return acc
  }
  return blogs.reduce(reducer,0)
}

const favourite = (blogs) => {
  const max = maxLikes(blogs)
  const reducer = (acc, val) => {
    if (val['likes'] === max){
      acc = {}
      acc['title'] = val['title']
      acc['author'] = val['author']
      acc['likes'] = val['likes']
      console.log(acc)
    }
    return acc
  }
  return blogs.reduce(reducer,)
}

module.exports = {
  dummy,
  totalLikes,
  favourite,
  maxLikes,
  mostLikes,
  mostBlogs
}