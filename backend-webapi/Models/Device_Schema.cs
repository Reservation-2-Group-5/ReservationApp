using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; //Should be good, need to check schema

namespace Reservation.Models
{
    public class Device
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Tag { get; set; } 

        [Required]
        [StringLength(255)] 
        public required string Model_Category { get; set; }

        [Required]
        [StringLength(255)] 
        public required string Device_Display_Name { get; set; }

        [StringLength(255)] 
        public required string Assigned_To { get; set; }

        [StringLength(255)] 
        public required string Reserved_NetID { get; set; }

        [StringLength(255)] 
        public required string Location { get; set; }

        public required string Funding_Source { get; set; }
        public required string Dept_Ownership {  get; set; }
        public required string Serial_Number { get; set; }
        public int PO {  get; set; }
        public DateOnly Warranty_EXP { get; set; }

        public bool Available { get; set; } // Assuming this is a boolean in database
        


        

        // Maybe include navigation properties for related entities if using Entity Framework????
        // public virtual User AssignedUser { get; set; }
        // public virtual ICollection<DeviceRes> DeviceReservations { get; set; }
    }
}
