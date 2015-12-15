

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import edu.stanford.nlp.ie.AbstractSequenceClassifier;
import edu.stanford.nlp.ie.crf.CRFClassifier;
import edu.stanford.nlp.ling.CoreLabel;

public class Pipeline {


	public String processRequest() throws Exception {

		BufferedReader br = new BufferedReader(new FileReader(new File("./temp.xml")));
		String st = "";
		String xml = "";
		while ((st = br.readLine()) != null) {
			xml = xml + st;
		}
		br.close();
		Document doc = Jsoup.parse(xml);
		// System.out.println(doc);
		Elements elements = doc.select("doc");
		JSONArray result = new JSONArray();
		for (Element element : elements) {
			String date = element.select("date").text().split("T")[0];
			String heading = element.select("str").get(0).text();
			String body = element.select("str").get(1).text();
			String url = element.select("str").get(2).text();
			String source = element.select("str").get(3).text();
			String location = element.select("str").get(4).text();
			String longitude = element.select("str").get(5).text();
			String lat = element.select("str").get(6).text();
			

			
			// System.out.println(location);
			// if(!body.toLowerCase().equals("unknown") && (location.equals("")
			// || location.equals("null")))
			// location = tagger.getNERTags(body, classifier);

			

			JSONObject content = new JSONObject();

			JSONObject timeInner = new JSONObject();
			timeInner.put("from", date);
			timeInner.put("toTimeStamp", "null");

			content.put("time", timeInner);

			JSONObject geoInner = new JSONObject();
			geoInner.put("location", location);
			geoInner.put("latitude", lat);
			geoInner.put("longtitude", longitude);

			content.put("geo", geoInner);

			JSONObject newsContent = new JSONObject();
			newsContent.put("title", heading);
			newsContent.put("abstract", body);
			// newsContent.put("summary", summary);
			newsContent.put("url", url);
			newsContent.put("source", source);
			content.put("newsContent", newsContent);

			result.put(content);

		}

		return result.toString();

	}

	public static void main(String[] args) throws Exception {
		String query = args[0];
		Pipeline pp = new Pipeline();
		if (ResultGenerator.GetResults(query) == -1)
			System.out.println("Result not generated");
		else {
			System.out.println(pp.processRequest());
		}
	}

}
