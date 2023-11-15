using System;
using System.ComponentModel.DataAnnotations; //Need to check primary keys and schema


namespace ReservationApp.Models
{
    public class Room
    {
        [Key]
        public required string Building { get; set; }
        
        public required string RoomNumber { get; set; }
        
        [Required]
        public DateTime Date { get; set; }

        [Required]
        public DateTime Time { get; set; } 

        public bool Available { get; set; }

        [StringLength(255)]
        public required string Reserved_Name { get; set; } 

        public long Reserved_NetID { get; set; }

        public int Max_Occupancy { get; set; }
        public bool Is_Office { get; set; }
        
    }
}

