

public class ResultGenerator {

	public static int GetResults(String input) {

		//String input = "apple samsung";
		String split[] = input.split(" ");
		String qString = "headline:"+split[0];
		int max = Integer.MAX_VALUE;
		if(split.length > 1)
		{
			for(int ind = 1;ind<split.length;ind++)
			{
				String str = split[ind];
				qString = qString+"+AND+headline:"+str;
			}
		}
		qString = qString.substring(0, qString.length());
		String command = "curl -o temp.xml 'http://localhost:8983/solr/new_core1/select?q="+qString+"&sort=date+desc&wt=xml&indent=true&rows="+max+"'";
		//System.out.println(command);
		Runtime run = Runtime.getRuntime();
		// Process proc = run.exec(command);
		Process proc;
		try {
			proc = run.exec(new String[]{"/bin/sh", "-c", command});
			proc.waitFor();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return -1;
		} 
		return 0;
	}

}
