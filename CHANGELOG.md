## ChangeLog for: chainjs

## Version 0.1.10 - 2015/1/6
- [Optimize] Max functions call stack up to 2000
- [Optimize] Remove calling argument.slice in step-function's iterator

## Version 0.1.9 - 2015/1/6
- [Feature] add .nextTo() and .branch() methods for branch goto flow

## Version 0.1.7 - 2015/1/5
- [Feature] add Chain.thunk() for turn a regular node function into chainjs thunk  

## Version 0.1.6 - 2015/1/4
- [Feature] remove ES5 function usage(forEach, bind)

## Version 0.1.4 - 2015/1/4

- [Feature] add each() api for call each step's handlers in sequeue

## Version 0.1.2 - 2014/12/3

- [Feature] add retry() api
- [Bug] pass arguments to final step when chain.next and has no next step.

## Version 0.1.1 - 2014/12/2

- [Feature] start() can pass data to initial step.
- [Bug] fixed "data" method bug
- [Bug] destroy() stop anything and release private data in chain's scope.
- [Testing] BDD testing

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
