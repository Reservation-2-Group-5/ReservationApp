using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; //Should be good, need to check schema

namespace ReservationApp.Models
{
    public class RoomRes
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long NetID { get; set; }
        public int id { get; set; }

        [Required]
        public required string Building { get; set; } // Assuming this corresponds to a Building ID

        [Required]
        public required string RoomNumber { get; set; } // Assuming this corresponds to a Room ID

        [Required]
        public DateOnly Request_Date { get; set; }

        [Required]
        public int Time {  get; set; }

        [Required]
        public DateOnly Date { get; set; }
    }
}