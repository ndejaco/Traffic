import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class timeFilter {

	public static void main(String[] args) {
		File file = new File(args[0]);
		String[] temp;
		String lastTripId = "";
		String lastTime = "";
		ArrayList<String> trip = new ArrayList<String>();
		int tripIndex = -1, timeIndex = -1;
		boolean brokenTrip = false;
		int lines = 0;
		try (BufferedReader br = new BufferedReader(new FileReader(file))) {

			String start = br.readLine();
			System.out.println(start);
			temp = start.split(",");
			tripIndex = getIndex("TripID", temp);
			timeIndex = getIndex("unixtime", temp);

			for (String line; (line = br.readLine()) != null;) {
				temp = line.split(",");

				if (lastTripId.equals(temp[tripIndex])) {
					if (!brokenTrip && checkTime(timeIndex, lastTime, temp)) {
						trip.add(line);

					}

					else {

                                         	trip = new ArrayList<String>();
						brokenTrip = true;
						if(!checkTime(timeIndex, lastTime, temp)){
						System.err.println(lastTripId + ":" + (Long.parseLong(temp[timeIndex]) - Long.parseLong(lastTime)));
						}
					}
				}

				else {
						for (String s : trip) {
						    System.out.println(s);
						}


					brokenTrip = false;
				}

				lastTripId = temp[tripIndex];
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

                for (String s: trip) {
                     System.out.println(s);
                }
	}

	public static boolean checkTime(int timeIndex, String lastTime, String[] temp) {

		long lTime = Long.parseLong(lastTime);
		long nTime = Long.parseLong(temp[timeIndex]);

		if ((long) (nTime - lTime) > 6000) {
			return false;
		}

		return true;
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
