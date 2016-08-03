// var persons = [
//     {id: 100, name: '张某某', year: 1989, hometown: '北京'},
//     {id: 101, name: '李某某', year: 1991, hometown: '上海'},
//     {id: 102, name: '顾某某', year: 1984, hometown: '广州'},
//     {id: 103, name: '王某某', year: 1981, hometown: '杭州'},
//     {id: 104, name: '孙某某', year: 1990, hometown: '合肥'}
// ];

// var nest = d3.nest()
//              .key(function (d) {
//                  return d.id;
//              })
//              .key(function (d) {
//                  return d.year;
//              })
//              .entries(persons);
             
// console.log(nest);

// var newNest= d3.nest()
//                .key(function (d) { return d.year })
//                .sortKeys(d3.descending)
//                .key(function (d) { return d.id })
//                .entries(persons);
// console.log(newNest);


var persons = [
    {sex: '男', age: 48, name: '张某某'},
    {sex: '女', age: 32, name: '李某某'},
    {sex: '女', age: 18, name: '王某某'},
    {sex: '男', age: 23, name: '赵某某'},
    {sex: '女', age: 31, name: '孙某某'},
];

// var nest = d3.nest()
//              .key(function (d) { return d.sex })
//              .sortValues(function (a, b) {
//                  return d3.ascending(a.age, b.age);
//              })
//              .entries(persons);

// var nest = d3.nest()
//              .key(function (d) { return d.sex })
//              .rollup(function (values) { return values.length })
//              .entries(persons);
// console.log(nest);

var nest = d3.nest()
             .key(function (d) { return d.sex })
             .map(persons, d3.map);
console.log(nest);