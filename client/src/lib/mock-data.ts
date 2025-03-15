import { ChatRoom, ChatMessage } from "../contexts/ChatContext";

export const mockRooms: ChatRoom[] = [
  {
    id: "1",
    name: "Sales Analytics",
    createdAt: "2024-03-20T10:00:00Z",
    dbType: "sql",
    dbms: "postgresql",
    username: "admin",
    databaseName: "sales_db",
    host: "localhost",
    port: 5432,
  },
  {
    id: "2",
    name: "User Metrics",
    createdAt: "2024-03-19T15:30:00Z",
    dbType: "sql",
    dbms: "mysql",
    username: "analyst",
    databaseName: "metrics_db",
    host: "localhost",
    port: 3306,
  },
];

export const mockResponses = [
  {
    sql_query: "SELECT DATE_TRUNC('month', payment_date) AS month, SUM(amount) AS revenue FROM payment WHERE DATE_PART('year', payment_date) = (SELECT MAX(DATE_PART('year', payment_date)) FROM payment) GROUP BY month ORDER BY month;",
    natural_language: "The monthly revenue for the latest year (2007) is as follows: February: 8351.84, March: 23886.56, April: 28559.46, and May: 514.18.",
    kind_of_chart: "line",
    data: {
      labels: ["February", "March", "April", "May"],
      values: [8351.84, 23886.56, 28559.46, 514.18],
    },
  },
  {
    sql_query: "SELECT c.name, COUNT(r.rental_id) as rental_count FROM category c JOIN film_category fc ON c.category_id = fc.category_id JOIN film f ON fc.film_id = f.film_id JOIN inventory i ON f.film_id = i.film_id JOIN rental r ON i.inventory_id = r.inventory_id GROUP BY c.name ORDER BY rental_count DESC LIMIT 5;",
    natural_language: "Top 5 most rented movie categories are: Sports (1179 rentals), Animation (1166 rentals), Action (1112 rentals), Sci-Fi (1101 rentals), and Family (1096 rentals).",
    kind_of_chart: "bar",
    data: {
      labels: ["Sports", "Animation", "Action", "Sci-Fi", "Family"],
      values: [1179, 1166, 1112, 1101, 1096],
    },
  },
];
