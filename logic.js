$(document).ready(function() {
  //load click events
  loadClickEvents();
});

function loadClickEvents(){
  //Loads click events for buttons in general
  $("#button_go").on("click", function(){
    evaluateFormula(document.getElementById("input_formula").value);
  });
  $("#input_formula").focus();
  $('[name=_and]').on("click", function(){
    addChar("&and;");
  });
  $('[name=_or]').on("click", function(){
    addChar("&or;");
  });
  $('[name=_not]').on("click", function(){
    addChar("&not;");
  });
  $('[name=_open]').on("click", function(){
    addChar("&#40;");
  });
  $('[name=_close]').on("click", function(){
    addChar("&#41;");
  });
  $('[name=_theorem]').on("click", function(){
    addChar("&#8866;");
  });
  $('[name=_tautology]').on("click", function(){
    addChar("&#8872;");
  });
  $('[name=_univ]').on("click", function(){
    addChar("&#8704;");
  });
  $('[name=_exist]').on("click", function(){
    addChar("&#8707;");
  });
  $('[name=_xor]').on("click", function(){
    addChar("&#8853;");
  });
  $('[name=_impl]').on("click", function(){
    addChar("&#8594;");
  });
  $('[name=_leq]').on("click", function(){
    addChar("&#8596;");
  });
}

function addHistory(formula){
  /*Adds a formula to the history list
  Input: the formula*/
  $("#container_history").append( "<h3 class=\"history_element\">" + formula + "</h3>" );
  $(".history_element").on("click", function(){
    document.getElementById("input_formula").value = this.innerHTML;
  });
  document.getElementById("history_clear").style.display = "inline";
  $("#history_clear").on("click", function(){
    $(".history_element").remove();
    document.getElementById("history_clear").style.display = "none";
  });
}

function indexLevels(formula){
  /*Gives indexes to subformulas in a given formula
  Input: the formula*/
  var levels = [];
  var currentLevel = 0;
  for(var i=0;i<formula.length;i++){
    if(formula[i] == "("){
      currentLevel++;
      levels.push(currentLevel);
    }else if(formula[i] == ")"){
      levels.push(currentLevel);
      currentLevel--;
    }else{
      levels.push(currentLevel);
    }
  }
  return levels;
}

function selectHighestSublevel(levels){
  /*Selects the highest sublevel based on its index
  Input: levels - the formula containing indexes
  Output: a list containing two elements - the marginal indexes of the highest sublevel*/
  var mx = 0;
  for(var i=0;i<levels.length;i++){
    if(levels[i] > mx){
      mx = levels[i];
    }
  }
  var i=-1,j=-1,end=false;
  for(var idx=0;idx<levels.length;idx++){
    if(levels[idx] == mx && end==false){
      if(i==-1){
        i=idx;
      }else{
        j=idx;
      }
    }else{
      if(i!=-1){
        end = true;
      }
    }
  }
  return [i,j];
}

function addChar(chr){
  /*Adds a character to the input element (formula writer)
  Input: the character*/
  var inp = document.getElementById("input_formula").value;
  var ofs = document.getElementById("input_formula").selectionStart;

  chr = decodeHtml(chr);
  inp = replaceChar(ofs,inp,chr);

  document.getElementById("input_formula").value = inp;
  $("#input_formula").focus();
  document.getElementById("input_formula").selectionStart=ofs+1;
  document.getElementById("input_formula").selectionEnd=ofs+1;
}

function checkNumberParanthesis(formula){
  /*Checks if the number of Paranthesis is balanced
  Input: the formula
  Output: true if its balanced, false otherwise*/
  a=0;
  b=0;
  for(var i=0;i<formula.length;i++){
    if(formula[i] == "("){
      a++;
    }else if(formula[i] == ")"){
      if(b>=a){
        return false;
      }
      b++;
    }
  }
  if(a==b){
    return true;
  }
  return false;
}

function clearEvaluation(){
  /*Clears the evaluation container*/
  document.getElementById('container_evaluation').innerHTML = "<h2 id=\"evaluation_message\">loaded</h2><h2 class=\"evaluation_formula\"></h2>";
}

function decreaseHighestSublevel(levels, lvl){
  for(var i=0;i<levels.length;i++){
    if(levels[i] == lvl){
      levels[i] = lvl-1;
    }
  }
  return levels;
}

function differentLevels(levels){
  for(var i=1;i<levels.length;i++){
    if(levels[i] != levels[i-1]){
      return true;
    }
  }
  return false;
}

function evaluateFormula(formula){
  /*Evaluates a given Formula
  Input: the formula to be evaluated*/
  clearEvaluation()
  correct = true;
  errorMessage = "";

  if(formula.length == 0){
    correct = false;
    errorMessage = "Empty formula";
  }

  if(checkNumberParanthesis(formula) == false){
    correct = false;
    errorMessage = "Invalid combination of '(' and ')'";
  }
  if(correct == true){
    document.getElementById('evaluation_message').innerHTML = "";
    document.getElementsByClassName('evaluation_formula')[0].innerHTML = formula;

    addHistory(formula);

    var levels = indexLevels(formula);
    while(differentLevels(levels)){
      var indexes = selectHighestSublevel(levels);
      var formula_solved_implication = implicationSolverRecursively(formula.substring(indexes[0]+1,indexes[1]));
      var lShell = formula.substring(0,indexes[0]+1);
      var rShell = formula.substring(indexes[1],formula.length);
      formula = lShell + formula_solved_implication + rShell;
      //levels = indexLevels(formula);
      levels = decreaseHighestSublevel(levels, levels[indexes[0]]);
    }

    formula = implicationSolverRecursively(formula);

    formula = deMorgan(formula);
    formula = removeRedundantParanthesis(formula);
    $( "#container_evaluation" ).append( "<h2>Result: " + formula + "</h2>");

    //display information
    var info = collectInformation(formula);
    var cont_info = document.getElementById("container_information");
    var nf = detectNormalForm(formula);
    if(nf == false){
        nf = "Could not decide the type of normal form";
    }
    cont_info.getElementsByTagName("ul")[0].getElementsByTagName("li")[0].innerHTML = nf;
    cont_info.getElementsByTagName("ul")[0].getElementsByTagName("li")[1].getElementsByTagName("label")[0].innerHTML = info[0];
    cont_info.getElementsByTagName("ul")[0].getElementsByTagName("li")[2].getElementsByTagName("label")[0].innerHTML = info[1];
    cont_info.getElementsByTagName("ul")[0].getElementsByTagName("li")[3].getElementsByTagName("label")[0].innerHTML = info[2];
    cont_info.style.display = "block";
  }else{
    document.getElementById('evaluation_message').innerHTML = "Error - "+errorMessage;
  }
}

function containsImplication(formula){
  /*Checks if a given formula containes an implication
  Input: the Formula
  Output: true if it contains, false otherwise*/
  for(var idx=0;idx<formula.length;idx++){
    if(formula[idx] == decodeHtml('&#8594;')){
      return true;
    }
  }
  return false;
}

function implicationSolverRecursively(formula){
  if(containsImplication(formula) == false){
    return formula;
  }
  var impl = solveImplication(formula);
  var lOperand = implicationSolverRecursively(impl[0]);
  var rOperand = implicationSolverRecursively(impl[1]);
  var idx = impl[2];
  if(rOperand.includes(decodeHtml("&and;")) || rOperand.includes(decodeHtml("&or;"))){
    rOperand+=")";
    rOperand = "("+rOperand;
  }
  if(lOperand.includes(decodeHtml("&and;")) || lOperand.includes(decodeHtml("&or;"))){
    lOperand+=")";
    lOperand = "("+lOperand;
  }
  var sub_formula = negateOperand(lOperand) + decodeHtml('&or;') + rOperand;
  sub_formula = removeRedundantParanthesis(sub_formula);
  $( "#container_evaluation" ).append( "<h3>Replacing the implication in " + formula + "</h3><h2>"+sub_formula+"</h2>" );
  return sub_formula;
}

//functions for building solution
function solveImplication(formula){
  var foundIdx = -1;
  var open = 0;
  var closed = 0;
  var outerMost = -1;
  var final_open = 0;
  var final_closed = 0;
  for(var idx=0;idx<formula.length;idx++){
    if(formula[idx] == decodeHtml('&#8594;')){
      foundIdx = idx;
      if(open-closed <= final_open-final_closed){
        final_open = open;
        final_closed = closed;
        outerMost = idx;
      }else if(outerMost == -1){
        outerMost = idx;
        final_open = open;
        final_closed = closed;
      }
    }
    else if(formula[idx] == decodeHtml('&#40;')){
      open++;
    }
    else if(formula[idx] == decodeHtml('&#41;')){
      closed++;
    }
  }
  foundIdx = outerMost;
  if(foundIdx!=-1){
    lOperand = getLeftOperand(formula,foundIdx);
    rOperand = getRightOperand(formula,foundIdx);
    lOperand = removeRedundantParanthesis(lOperand);
    rOperand = removeRedundantParanthesis(rOperand);
    //console.log(rOperand);
    formula = negateOperand(lOperand) + decodeHtml('&or;') + rOperand;
  }
  return [lOperand, rOperand, foundIdx];
}

function getLeftOperand(formula, idx){
  var op = "";
  if(formula[idx-1] == decodeHtml('&#41;')){
    idx-=1;
    var closed = 1;
    var open = 0;
    while(closed>open && idx>=0){
      if(formula[idx] == decodeHtml('&#40;')){
        open++;
      }else if(formula[idx] == decodeHtml('&#41;')){
        closed++;
      }
      op+=formula[idx];
      idx-=1;
    }
  }else{
    op+=formula[idx-1];
    idx-=2;
    //checking for negation
    if(formula[idx]==decodeHtml('&#172;')){
      op+=formula[idx];
    }
  }

  op = op.split("").reverse().join("");
  return op;
}

function getRightOperand(formula, idx){
  var op = "";
  if(formula[idx+1] == decodeHtml('&#172;')){
    op+=formula[idx+1];
    idx++;
  }
  if(formula[idx+1] == decodeHtml('&#40;')){
    idx+=1;
    var open = 1;
    var closed = 0;
    while(open>closed && idx < formula.length){
      if(formula[idx] == decodeHtml('&#40;')){
        open++;
      }else if(formula[idx] == decodeHtml('&#41;')){
        closed++;
      }
      op+=formula[idx];
      idx+=1;
    }
  }else{
    if(formula[idx+1]==decodeHtml('&#172;')){
      op+=formula[idx+1];
      op+=formula[idx+2];
    }else{
      op+=formula[idx+1];
    }
  }
  return op;
}

function removeRedundantParanthesis(form){
  /*Removes consecutive Paranthesis and also checks for variables with redundant brackets*/
  var idx=0, openCount=0, i,j, singleOpen=0;
  while(idx<form.length){
    if(form[idx] == "("){
      var nr=0;
      idx++;
      singleOpen++;
      while(form[idx] == "("){
        nr++;
        idx++;
      }
      if(nr>0){
        i=idx-nr-1;
        singleOpen--;
        openCount = nr;
        j=idx-1;
      }
    }else if(form[idx] == ")"){
      var nr=0;
      idx++;
      while(form[idx] == ")"){
        nr++;
        idx++;
      }
      if(openCount <= nr && openCount > 0){
        while(nr > 0){
          idx--;
          form = removeAt(form, idx);
          nr--;
        }
        while(openCount > 0){
          form = removeAt(form, i);
          openCount--;
        }
        idx=0;
        openCount = 0;
      }else{
        if(singleOpen>0){
          singleOpen--;
        }else{
          openCount--;
        }
      }
    }
    else{
      idx++;
    }
  }
  //searching for (x) to remove these brackets
  var levels = indexLevels(form);
  for(idx=0;idx<form.length-3;idx++){
    if(levels[idx] == levels[idx+1] && levels[idx+1] == levels[idx+2] && levels[idx+2]!=levels[idx+3]){
      if(form[idx] == "(" && form[idx+2] == ")"){
        if(idx>0 && form[idx-1] != decodeHtml('&#172;')){
          form = removeAt(form, idx);
          form = removeAt(form, idx+1);
        }
        levels = indexLevels(form);
      }
    }
  }
  //searching for (operand) to remove these brackets
  levels = indexLevels(form);
  var in_level = parseInt(levels[0]), fn_level = parseInt(levels[levels.length-1]);
  if(in_level == fn_level && form[0] == "(" && form[form.length-1] == ")"){
    var idx=1, deletePar = true;
    while(idx<form.length-1 && deletePar == true){
      if(parseInt(levels[idx]) < in_level){
        deletePar = false;
      }idx++;
    }
    if(deletePar == true){
      form = removeAt(form, 0);
      form = removeAt(form, form.length-1);
    }
  }

  return form;
}

function removeAt(form, idx){
  /*Removes a character from the given index from a given string
  Input: form - the string to be changed
         idx - the index to be removed
  Output: the modified string*/
  return form.substring(0,idx) + form.substring(idx+1,form.length);
}

function deMorgan(formula){
  /*Applies the De Morgan's laws to a given formula
  Input: the given formula
  Output: the modified formula*/
  var neg_pos = -1, idx=0;
  while(idx < formula.length && neg_pos == -1){
    if(formula[idx] == decodeHtml('&#172;')){
      neg_pos = idx;
    }
    idx++;
  }
  if(neg_pos == -1){
    return formula
  }
  var i=idx;
  var nrOpen = 1, nrClosed = 0;
  idx++;
  while(nrOpen!=nrClosed){
    if(formula[idx] == "("){
      nrOpen++;
    }else if(formula[idx] == ")"){
      nrClosed++;
    }
    idx++;
  }
  var j = idx-1;
  //we have figured out the scope
  var lShell = formula.substring(0,i-1)+"(";
  var rShell = formula.substring(j,formula.length);
  var negated = negateOperands(formula.substring(i+1,j)); // ¬(a→b)∨c - find a way to solve netagions
  return lShell+negated+rShell;
}

function negateOperands(form){
  /*Negates a sequence of operands in a formula
  Input: the operands as a string of characters
  Output: the modified operands
  */
  var idx=0,res="";
  while(idx<form.length){
    if(form[idx] == decodeHtml('&#172;')){
      //we have a negation
      idx+=2;
      var i = idx-1;
      while(form[idx]!=")"){
        idx++;
      }
      res+=form.substring(i,idx+1);
    }else{
      res+=negateOperand(form[idx])
    }
    idx++;
  }
  return res;
}

function negateOperand(op){
  /*Adds a negation symbol in front of a given operand
  Input: the operand
  Output: string of the form: &not + operand*/
  if(op == decodeHtml("&and;")){
    return decodeHtml("&or;");
  }else if(op == decodeHtml("&or;")){
    return decodeHtml("&and;");
  }
  if(op.length > 1){
    if(op[0] == decodeHtml('&#172;')){
      return op.substring(2,op.length-1);
    }
  }
  return decodeHtml('&#172;')+"("+op+")";
}

function replaceChar(pos, string, subs){
  /*Replaces a substring for a string with another substring
  Input: pos- the position in which to add it
        string - the string to be modified
        subs - the string to replace with
  */
  return string.substr(0, pos) + subs + string.substr(pos,string.length);
}

function decodeHtml(html) {
    /*
    Decodes a html string into its character form
    Input: the string to be decoded
    Output: its corresponding character
    */
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function collectInformation(formula){
  /*Collects information regarding the given formula
  Input: the formula to be analyzed
  Output: a list of the form [x,y,z] where x=nr of variables, y=nr of binary functions, z=nr of unary functions*/
  var nrBin = 0, nrUn = 0, nrVar = 0;
  for(var idx=0;idx<formula.length;idx++){
    if(formula[idx] == decodeHtml("&and;")){
      nrBin++;
    }else if(formula[idx] == decodeHtml("&or;") || formula[idx] == decodeHtml('&#172;')){
      nrUn++;
    }else{
      if(formula[idx] != "(" && formula[idx]!= ")"){
        nrVar++;
      }
    }
  }
  return [nrVar, nrBin, nrUn];
}

function detectNormalForm(formula){
  /*Check if it has only two levels*/
  var levels = indexLevels(formula);
  var i=0;
  while(i<formula.length){
    if(levels[i] == "3"){
      return false;
    }
    i++;
  }
  //traversing level 0
  var isDNF = true, isCNF = true, found = false;
  for(i=0;i<formula.length && (isDNF == true || isCNF == true);i++){
    if(levels[i] == "0"){
      if(formula[i] == decodeHtml("&and;")){
        isDNF = false;
        found = true;
      }else if(formula[i] == decodeHtml("&or;")){
        isCNF = false;
        found = true;
      }
    }
  }
  if(found == false){
    return false;
  }
  if(isDNF == true){
    return "DNF"
  }
  if(isCNF == true){
    return "CNF";
  }
  return false;
}
