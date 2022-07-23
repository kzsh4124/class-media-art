#Flaskとrender_template（HTMLを表示させるための関数）をインポート
from flask import Flask,render_template, request, jsonify
import pyaudio
#Flaskオブジェクトの生成
app = Flask(__name__)


#「/」へアクセスがあった場合に、"Hello World"の文字列を返す
@app.route("/")
def hello():
    return render_template("index.html")


@app.route("/increment", methods=["POST"])
def plusone():
    req = request.form
    res = {"count": int(req["count"])+1}
    return jsonify(res)

#おまじない
if __name__ == "__main__":
    app.run(debug=True)