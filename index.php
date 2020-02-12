
<?php

 ?>
<html>
<head>
  <title>Computational Logic Formula Solver</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" type="text/javascript"></script>
  <link rel="stylesheet" href="style.css" type="text/css">
  <script src="logic.js" type="text/javascript"></script>
</head>
<body>
  <div id="container_title">
    <h1>Computational Logic Formula Solver</h1>
  </div>
  <div id="container_main">
    <div id="container_main_sub">
      <h2>Enter formula:</h2>
      <input id="input_formula" placeholder="Enter your formula here"></input>
      <h2 id="button_go">Go</h2>
    </div>
    <div id="container_buttons">
      <table>
        <tr>
          <th><h4 class="character" name="_and">&and;</h4></th>
          <th><h4 class="character" name="_or">&or;</h4></th>
          <th><h4 class="character" name="_not">&#172;</h4></th>
          <th><h4 class="character" name="_open">&#40;</h4></th>
          <th><h4 class="character" name="_close">&#41;</h4></th>
          <th><h4 class="character" name="_impl">&#8594;</h4></th>
        </tr>
        <tr>
          <th><h4 class="character" name="_theorem">&#8866;</h4></th>
          <th><h4 class="character" name="_tautology">&#8872;</h4></th>
          <th><h4 class="character" name="_univ">&#8704;</h4></th>
          <th><h4 class="character" name="_exist">&#8707;</h4></th>
          <th><h4 class="character" name="_xor">&#8853;</h4></th>
          <th><h4 class="character" name="_leq">&#8596;</h4></th>
        </tr>
      </table>

    </div>

  </div>

  <div id="container_history">
    <h2>History</h2>
    <label id="history_clear">Clear</label>
  </div>

  <div id="container_evaluation">
    <h2 id="evaluation_message"></h2>
    <h2 class="evaluation_formula"></h2>
  </div>

  <div id="container_information">
    <h2>Details:</h2>
    <ul>
      <li>This formula is not in a normal form.</li>
      <li>Number of variables: <label>x</label></li>
      <li>Binary operations: <label>y</label></li>
      <li>Unary operations: <label>z</label></li>
    </ul>
  </div>
</body>
</html>
