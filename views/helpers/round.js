module.exports = function(num) {
  
  if (num === null){
    return null;
  }
  return Math.round(num*100)/100;
};