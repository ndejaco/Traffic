import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class Parser {

	public static void main(String[] args) {
		File file = new File(args[0]);
		String[] temp;
		String lastTripId = "";
		String lastLat = "";
		String lastLong = "";
		String lastTime = "";
		int latIndex = -1, longIndex = -1, tripIndex = -1, timeIndex = -1;
		try(BufferedReader br = new BufferedReader(new FileReader(file))) {
			 temp = br.readLine().split(",");
		     latIndex = getIndex("LocationLatitude", temp);
		     longIndex = getIndex("LocationLongitute", temp);
		     tripIndex = getIndex("TripID", temp);
		     timeIndex = getIndex("unixtime", temp);
			
		    for(String line; (line = br.readLine()) != null; ) {
		         temp = line.split(",");
		         
		         if (lastTripId.equals(temp[tripIndex])) {
		        	 if (checkDistance(latIndex, tripIndex, lastLat, lastLong, lastTime, temp)) {
		        		 System.out.println(line);
		        	 }
		         }
		         
		         else {
		        	 System.out.println(line);
		         }
		         
		         lastTripId = temp[tripIndex];
		         lastLat = temp[latIndex];
		         lastLong = temp[longIndex];
		         lastTime = temp[timeIndex];
		 
		     
		    }
		    // line is not visible here.
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static boolean checkDistance(int latIndex, int timeIndex, String lastLat, String lastLong, String lastTime, String[] temp) {
		double dLastLat = Double.parseDouble(lastLat);
		double dLastLong = Double.parseDouble(lastLong);
		double nLat = Double.parseDouble(temp[latIndex]);
		double nLong = Double.parseDouble(temp[latIndex+1]);
		double dLastTime = Double.parseDouble(lastTime);
		double nTime = Double.parseDouble(temp[timeIndex]);
		
		double difference = (nTime - dLastTime) * 0.001;
	
		double mDistance = distance(dLastLat, dLastLong, nLat, nLong, "K")*1000;
		
		if (difference > 0) {
			if ((double) (mDistance/difference) > 49.1744) {
				return false;
			}
			
			return true;
		}
	 
		else {
	        return true;
		}
	}
	private static double distance(double lat1, double lon1, double lat2, double lon2, String unit) {
		double theta = lon1 - lon2;
		double dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
		dist = Math.acos(dist);
		dist = rad2deg(dist);
		dist = dist * 60 * 1.1515;
		if (unit == "K") {
			dist = dist * 1.609344;
		} else if (unit == "N") {
			dist = dist * 0.8684;
		}

		return (dist);
	}
	
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	/*::	This function converts decimal degrees to radians						 :*/
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	private static double deg2rad(double deg) {
		return (deg * Math.PI / 180.0);
	}

	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	/*::	This function converts radians to decimal degrees						 :*/
	/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
	private static double rad2deg(double rad) {
		return (rad * 180 / Math.PI);
	}
	
	private static int getIndex(String header, String[] arr) {
		for (int i = 0; i < arr.length; i++) {
			if (arr[i].equals(header)) {
				return i;
			}
		}
		
		return -1;
	}

	

}

