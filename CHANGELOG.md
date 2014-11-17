## ChangeLog for: chainjs

## Version 0.1.1 - 2014/11/17

- [Bug] fixed "data" method bug

## Version 0.1.0 - 2014/11/17

- [APIs]: remove "filter", "before", "sham" methods, and use "destroy" instead of "stop"
- [Feature]: Chain refactor using Class Constructor for less memory usage. The code is more clear.
- [Feature]: Add "some" method, support define multiple Parallel functions in one step
- [Feature]: Add "wait" method, use for replacing setTimeout call chain.next()

## Version 0.0.3-2 - 2014/1/17

- [Fix bug]: data() api using extend to export chain data instead of return private data variable

## Version 0.0.3 - 2014/1/1

- [Feature]: Add Chain.sham api, for calling chain step-handler normally

## Version 0.0.2 - 2013/12/27

- [Feature]: add filter() api 
- [Feature]: addstop() api

## Version 0.0.1 - 2013/12/25

- [Normal]: Pop step handler use cursor index instead of handlers.shift
- [Feature]: Implement AOP: before() api
