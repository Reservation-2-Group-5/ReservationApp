using Reservation.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; //Need to update models if database has changed

namespace ReservationApp.Models
{
    public class DeviceRes
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        
        public long NetID { get; set; }
        public int Tag { get; set; }

        [Required]
        public DateTime Request_Date { get; set; }

        [Required]
        public DateTime Start_Date { get; set; }

        [Required]
        public DateTime End_Date { get; set; }

       

        public virtual required User User { get; set; }
       
        public virtual required Device Device { get; set; }
    }
}
