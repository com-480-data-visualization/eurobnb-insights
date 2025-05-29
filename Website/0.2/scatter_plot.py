import pandas as pd
import matplotlib.pyplot as plt

# List of cities (add more as needed)
cities = [
    "paris",
    "berlin",
    "amsterdam",
]

base_url = "https://raw.githubusercontent.com/com-480-data-visualization/eurobnb-insights/master/Dataset/Processed-Dataset/"

for city in cities:
    for day_type in ["weekdays", "weekends"]:
        url = f"{base_url}{city}_{day_type}.csv"
        try:
            df = pd.read_csv(url)
            # Make sure the columns exist and are numeric
            df['realSum'] = pd.to_numeric(df['realSum'], errors='coerce')
            df['guest_satisfaction_overall'] = pd.to_numeric(df['guest_satisfaction_overall'], errors='coerce')
            df = df.dropna(subset=['realSum', 'guest_satisfaction_overall'])
            plt.figure(figsize=(8,6))
            plt.scatter(df['realSum'], df['guest_satisfaction_overall'], alpha=0.5)
            plt.xlabel('Price (€)')
            plt.ylabel('Guest Satisfaction')
            plt.title(f'{city.title()} Airbnb: Price vs Guest Satisfaction ({day_type.title()})')
            plt.grid(True)
            plt.tight_layout()
            filename = f"{city}_{day_type}_scatter.png"
            plt.savefig(filename, dpi=300)
            print(f"Saved: {filename}")
            plt.close()
        except Exception as e:
            print(f"Failed for {city} {day_type}: {e}")
