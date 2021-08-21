/**
 * Debounces information (Take Only Last Input)
 * @param func Callback function for execution
 * @param timeout Delay after last input ::default(500)
 * @returns Execution of 'func'
 * 
 * @example
 * // On call of processChange, given a >500ms gap - will sync data.
 * let saveInput = () => { console.log("Saved Data") }
 * const processChange = debounce(() => saveInput());
 */
export default function debounce(func, wait, immediate?) {
	var timeout, previous, args, result, context;
  
	var later = function() {
	  var passed = new Date().getTime() - previous;
	  if (wait > passed) {
		timeout = setTimeout(later, wait - passed);
	  } else {
		timeout = null;
		if (!immediate) result = func.apply(context, args);
		if (!timeout) args = context = null;
	  }
	};
  
	return restArguments(function(_args) {
	  context = this;
	  args = _args;
	  previous = new Date().getTime();

	  if (!timeout) {
		timeout = setTimeout(later, wait);
		if (immediate) result = func.apply(context, args);
	  }

	  return result;
	});
}

function restArguments(func, startIndex?) {
	startIndex = startIndex == null ? func.length - 1 : +startIndex;
	return function() {
	  var length = Math.max(arguments.length - startIndex, 0),
		  rest = Array(length),
		  index = 0;
	  for (; index < length; index++) {
		rest[index] = arguments[index + startIndex];
	  }
	  switch (startIndex) {
		case 0: return func.call(this, rest);
		case 1: return func.call(this, arguments[0], rest);
		case 2: return func.call(this, arguments[0], arguments[1], rest);
	  }
	  var args = Array(startIndex + 1);
	  for (index = 0; index < startIndex; index++) {
		args[index] = arguments[index];
	  }
	  args[startIndex] = rest;
	  return func.apply(this, args);
	};
  }