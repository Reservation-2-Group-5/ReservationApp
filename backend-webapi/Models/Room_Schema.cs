using System;
using System.ComponentModel.DataAnnotations; //Need to check primary keys and schema

namespace ReservationApp.Models
{
    public class Room
    {
        [Key]
        public string Building { get; set; } 

        [Key]
        public string RoomNumber { get; set; } 

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public DateTime Time { get; set; } 

        public bool Available { get; set; }

        [StringLength(255)]
        public string ReservedName { get; set; } 

        public long? ReservedNetID { get; set; }

        public int MaxOccupancy { get; set; }
        public bool IsOffice { get; set; }
    }
}

